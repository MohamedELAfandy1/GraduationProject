const { randomInt } = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userModel = require("../models/userModel");
const { accessToken, refreshToken } = require("../utils/tokens");
const sendEmail = require("../utils/sendEmail");
const redisClient = require("../config/redis");
const passport = require("passport");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const otp = randomInt(100000, 999999).toString();

    const hashedPassword = await bcrypt.hash(password, 12);

    const userData = { name, email, password: hashedPassword };
    await redisClient.set(email, JSON.stringify({ otp, userData }), "EX", 300);

    await sendEmail({
      email: email,
      subject: "Your Verification Code(Valid For 2min)",
      message: `Hi ${name},\n
        We Received A Request To Verify Your Account.\n
        ${otp}\n 
        Enter This Code To Complete Verifiction. \n`,
    });

    res.status(200).json({
      message: "OTP Send To Your Email",
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const { otp, email } = req.body;
    // const email = req.headers["x-user-email"];

    if (!email || !otp)
      return res.status(400).json({ message: "Missing OTP or email" });

    const redisData = await redisClient.get(email);
    if (!redisData) return res.status(400).json({ message: "OTP expired" });

    const parsedData = JSON.parse(redisData);
    if (parsedData.otp != otp)
      return res.status(400).json({ message: "Wrong OTP" });

    const userData = parsedData.userData;
    const user = await userModel.create(userData);

    const token = accessToken(user._id);
    await refreshToken(user._id);

    await redisClient.del(email);
    const { password, ...safeUser } = user.toObject();

    res.status(201).json({ data: safeUser, token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    let isMatched = await bcrypt.compare(
      String(password),
      String(user.password)
    );
    if (!isMatched) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const at = accessToken(user._id);
    await refreshToken(user._id);
    const { password: _p, ...safeUser } = user.toObject();

    res.status(200).json({ token: at, ...safeUser });
  } catch (err) {
    next(err);
  }
};

exports.auth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new Error("You are Not Logging In"));
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded || !decoded.userId) {
      return next(new Error("Invalid Signature"));
    }

    const currentUser = await userModel.findById(decoded.userId);
    if (!currentUser) {
      return next(
        new Error("The User Belong To This Token Is No Longer Exist")
      );
    }

    if (currentUser.passwordChangedAt) {
      const passwordChangedTimeStamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10
      );
      if (passwordChangedTimeStamp > decoded.iat) {
        return next(
          new Error("User Recently Change His Password Please Login Again...")
        );
      }
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return next(new Error("Invalid or expired token"));
  }
};

exports.auth2 = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded || !decoded.userId) {
      return next();
    }

    const currentUser = await userModel.findById(decoded.userId);
    if (!currentUser) {
      return next();
    }

    if (currentUser.passwordChangedAt) {
      const passwordChangedTimeStamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10
      );
      if (passwordChangedTimeStamp > decoded.iat) {
        return next(
          new Error("User Recently Change His Password Please Login Again...")
        );
      }
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return next(new Error("Invalid or expired token"));
  }
};

exports.allowedTo =
  (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("You Are Not Allowed To Access This Route"));
    }
    next();
  };

//Send Automatic every 5 min
exports.refresh = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const storedToken = await redisClient.get(userId);
    if (!storedToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No refresh token found" });
    }

    const { rt } = JSON.parse(storedToken);
    const decoded = jwt.verify(rt, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded || decoded.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    const newAccessToken = accessToken(decoded.userId);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh Token Error:", err);
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { currentAccessToken } = req.body;
    if (!currentAccessToken) return res.status(400).json("You Are Not Log In");

    const decoded = jwt.verify(
      currentAccessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!decoded?.userId) {
      return res.status(400).json({ message: "Invalid token" });
    }
    await redisClient.del(decoded.userId.toString());
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.forgetPassword = async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new Error("No User For This Email"));
  }

  const resetCode = randomInt(100000, 999999).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  user.passwordResetCodeExpires = Date.now() + 2 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Passsword Reset Code(Valid For 2min)",
      message: `Hi ${user.name},\n
      We Received A Reequest To Reset Password On Account.\n
      ${resetCode}\n 
      Enter This Code To Compelete Reset. \n`,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new Error("There Is An Error In Sending Email"));
  }
  res
    .status(200)
    .json({ status: "SUCCESS", message: "Reset Code Sent To Email " });
};

exports.verifyPasswordResetCode = async (req, res, next) => {
  try {
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(req.body.passwordResetCode)
      .digest("hex");

    const user = await userModel.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new Error("Reset Code Invalid Or Expired"));
    }

    user.passwordResetVerified = true;
    await user.save();
    res.status(200).json({ status: "Success" });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return next(new Error("There Is No User For This Email"));
    }
    if (!user.passwordResetVerified) {
      return next(new Error("Reset Code Not Verified"));
    }

    user.password = await bcrypt.hash(req.body.newPassword, 12);
    user.passwordChangedAt = Date.now();

    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();

    const token = accessToken(user._id);
    await refreshToken(user._id);
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.google = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleCallBack = [
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/login",
  }),
  async (req, res) => {
    const user = req.user;
    const token = accessToken(user._id);
    await refreshToken(user._id);
    const { password, ...safeUser } = user.toObject();

    res.status(200).json({ token, user: safeUser });
  },
];
