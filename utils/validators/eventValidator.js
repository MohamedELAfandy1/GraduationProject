const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
// const categoryModel = require("../../models/categoryModel");
const apiError = require("../apiError");

exports.getEventValidator = [
  check("id").isMongoId().withMessage("Invalid Event ID format"),
  validatorMiddleware,
];

exports.createEventValidator = [
  check("name")
    .notEmpty()
    .withMessage("Event Name Required")
    .isLength({ min: 2, max: 32 })
    .withMessage("Event name must be between 2 and 32 characters"),

  check("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings"),
  check("images.*")
    .optional()
    .isString()
    .withMessage("Each image must be a string"),

  check("startDate")
    .notEmpty()
    .withMessage("Must Set StartDate")
    .isISO8601()
    .withMessage("Invalid StartDate format"),

  check("endDate")
    .notEmpty()
    .withMessage("Must Set EndDate")
    .isISO8601()
    .withMessage("Invalid EndDate format")
    .custom((val, { req }) => {
      const start = new Date(req.body.startDate);
      const end = new Date(val);

      if (start >= end) {
        throw new apiError("End Date Should Be After StartDate", 400);
      }
      return true;
    }),

  check("status").notEmpty().withMessage("Status Of Event Is Required"),
  check("location").custom((val) => {
    if (
      !val.type ||
      val.type !== "Point" ||
      !Array.isArray(val.coordinates) ||
      val.coordinates.length !== 2 ||
      typeof val.coordinates[0] !== "number" ||
      typeof val.coordinates[1] !== "number"
    ) {
      throw new apiError(
        "Location must be a valid GeoJSON Point with [longitude, latitude]",
        400
      );
    }
    return true;
  }),

  validatorMiddleware,
];

exports.updateEventValidator = [
  check("id").isMongoId().withMessage("Invalid Event ID Format"),

  check("name")
    .optional()
    .isLength({ min: 2, max: 32 })
    .withMessage("Event name must be between 2 and 32 characters"),

  check("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings"),
  check("images.*")
    .optional()
    .isString()
    .withMessage("Each image must be a string"),

  check("startDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid StartDate format"),

  check("endDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid EndDate format")
    .custom((val, { req }) => {
      const start = new Date(req.body.startDate);
      const end = new Date(val);

      if (start >= end) {
        throw new apiError("End Date Should Be After StartDate", 400);
      }
      return true;
    }),

  check("location").custom((val) => {
    if (
      !val.type ||
      val.type !== "Point" ||
      !Array.isArray(val.coordinates) ||
      val.coordinates.length !== 2 ||
      typeof val.coordinates[0] !== "number" ||
      typeof val.coordinates[1] !== "number"
    ) {
      throw new apiError(
        "Location must be a valid GeoJSON Point with [longitude, latitude]",
        400
      );
    }
    return true;
  }),
  validatorMiddleware,
];

exports.deleteEventValidator = [
  check("id").isMongoId().withMessage("Invalid Event ID Format"),
  validatorMiddleware,
];

exports.handleObjects = (req, res, next) => {
  if (req.body.location && typeof req.body.location === "string") {
    try {
      req.body.location = JSON.parse(req.body.location);
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Invalid JSON in location field" });
    }
  }
  next();
};
