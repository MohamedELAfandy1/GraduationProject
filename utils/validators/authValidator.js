const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const userModel = require("../../models/userModel");

exports.registerValidator = [
  check("name").notEmpty().withMessage("User Name Is Required"),

  check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom((value) =>
      userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email Already Used"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password Is Required")
    .isLength({ min: 4 })
    .withMessage("Password must Be At Least 4 Charachters"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirm Is Required")
    .custom((passwordConfirm, { req }) => {
      if (passwordConfirm != req.body.password) {
        throw new Error("Password Confirm InCorrect");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Invalid Email Address"),

  check("password").notEmpty().withMessage("Password Is Required"),
  validatorMiddleware,
];

exports.verfiyResetPasswordValidator = [
  check("passwordResetCode")
    .notEmpty()
    .withMessage("Email Is Required")
    .isString()
    .withMessage("Should Be In String Format"),

  validatorMiddleware,
];
