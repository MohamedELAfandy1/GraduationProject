const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const userModel = require("../models/userModel");
const factory = require("./handlersFactory");
const apiError = require("../utils/apiError");
const { accessToken } = require("../utils/tokens");
const { uploadSingleImage } = require("../middleware/imageUpload");

exports.uploadUserImage = uploadSingleImage("profileImage");

exports.resizeUserImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `User-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/user/${filename}`);

    req.body.profileImage = filename;
  }
  next();
});

exports.getAllUsers = factory.getAll(userModel);

exports.getUserById = factory.getOne(userModel);

exports.createUser = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password, role, phone, location } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

factory.createOne(userModel, [
  "name",
  "email",
  "password",
  "phone",
  "profileImage",
  "gender",
  "birthDate",
  "location",
  "preferences",
  "role",
  "active",
]);

exports.deleteUser = factory.deleteOne(userModel);

exports.updateUser = factory.updateOne(userModel, [
  "name",
  "email",
  "phone",
  "profileImage",
  "gender",
  "birthDate",
  "location",
  "preferences",
  "role",
  "active",
]);

//////////////////////////////////////////////////////////////

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  let user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) return next(new apiError("No Document For This Id", 404));

  const token = accessToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      gender: req.body.gender,
      birthDate: req.body.birthDate,
    },
    { new: true }
  );
  res.status(200).json({ data: updatedUser });
});

exports.deactiveLoggedUser = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: "Success" });
});

exports.getFavourites = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await userModel
    .findById(userId)
    .select("likedAttractions")
    .populate({
      path: "likedAttractions",
      select:
        "name category image ratings governorate district imageCover images ratingsAverage ratingsQuantity",
    });

  if (!user) {
    return res.status(404).json({ message: "User not found", code: 404 });
  }

  res.status(200).json({ data: user.likedAttractions });
});
