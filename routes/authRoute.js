const express = require("express");
const {
  register,
  verifyUser,
  login,
  refresh,
  logout,
  forgetPassword,
  verifyPasswordResetCode,
  resetPassword,
  google,
  googleCallBack,
} = require("../controllers/authController");
const {
  registerValidator,
  loginValidator,
  verfiyResetPasswordValidator,
} = require("../utils/validators/authValidator");
const bouncer = require("../middleware/bruteForcing");

const router = express.Router();

router.post("/register", registerValidator, register);

router.post("/verify", verifyUser);

router.post(
  "/login",
  //  bouncer.block,
  loginValidator,
  login
);

router.post("/refresh", refresh);

router.post("/forgetPassword", forgetPassword);

router.post(
  "/verifyResetCode",
  verfiyResetPasswordValidator,
  verifyPasswordResetCode
);

router.put("/resetPassword", resetPassword);

router.delete("/logout", logout);

router.get("/google", google);
router.get("/google/callback", googleCallBack);

module.exports = router;
