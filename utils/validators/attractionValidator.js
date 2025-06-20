const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const categoryModel = require("../../models/categoryModel");
const apiError = require("../apiError");

exports.getAttractionValidator = [
  check("id").isMongoId().withMessage("Invalid Attraction ID format"),
  validatorMiddleware,
];

exports.createAttractionValidator = [
  check("name")
    .notEmpty()
    .withMessage("Attraction Name Required")
    .isLength({ min: 2, max: 32 })
    .withMessage("Attraction name must be between 2 and 32 characters"),

  check("imageCover").notEmpty().withMessage("Image Cover Is Required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings"),
  check("images.*")
    .optional()
    .isString()
    .withMessage("Each image must be a string"),

  check("category")
    .notEmpty()
    .withMessage("Category Is Required")
    .isMongoId()
    .withMessage("Invalid ID Format")
    .custom(async (value) => {
      const category = await categoryModel.findById(value);
      if (!category) {
        throw new apiError("No Category For This ID", 400);
      }
      return true;
    }),

  check("governorate").notEmpty().withMessage("Governorate is required"),
  check("district").notEmpty().withMessage("District is required"),
  check("location")
    .notEmpty()
    .withMessage("Location is required")
    .custom((val) => {
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

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage Must Be Number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating Must Between 1.0 and 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings Quantity Must Be Number"),

  validatorMiddleware,
];

exports.updateAttractionValidator = [
  check("id").isMongoId().withMessage("Invalid Attraction ID Format"),

  check("name")
    .optional()
    .isLength({ min: 2, max: 32 })
    .withMessage("Attraction name must be between 2 and 32 characters"),

  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID Format")
    .custom(async (value) => {
      const category = await categoryModel.findById(value);
      if (!category) {
        throw new apiError("No Category For This ID", 400);
      }
      return true;
    }),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage Must Be Number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating Must Be Between 1.0 and 5.0"),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings Quantity Must Be Number"),

  check("location")
    .optional()
    .custom((val) => {
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

exports.deleteAttractionValidator = [
  check("id").isMongoId().withMessage("Invalid Attraction ID Format"),
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

exports.toggleLikeAttractionValidator = [
  check("id").isMongoId().withMessage("Invalid Attraction ID format"),
  validatorMiddleware,
];
