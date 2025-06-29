const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const reviewModel = require("../../models/reviewModel");
const userModel = require("../../models/userModel");

exports.createReviewValidator = [
  check("title")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Too Short Review Name")
    .isLength({ max: 320000 })
    .withMessage("Too Long Review Name"),
  check("ratings")
    .notEmpty()
    .withMessage("Rating Is Required")
    .isFloat({ min: 1.0, max: 5.0 })
    .withMessage("Ratings Value Must Between 1 And 5"),

  check("attraction")
    .notEmpty()
    .withMessage("attraction Is Required")
    .isMongoId()
    .withMessage("Invalid attraction ID Format"),
    // .custom((val, { req }) =>
    //   reviewModel
    //     .findOne({ user: req.user._id, attraction: req.body.attraction })
    //     .then((review) => {
    //       if (review) {
    //         return Promise.reject(
    //           new Error(
    //             "You Already Created A Review For This attraction Before"
    //           )
    //         );
    //       }
    //     })
    // ),

  validatorMiddleware,
];
exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID Format")
    .custom((val, { req }) =>
      reviewModel.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error("There Is no Review For This ID"));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are Not Allowed To Perform This Action")
          );
        }
      })
    ),
  check("attraction").isEmpty().withMessage("You Cannot Update Attraction"),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID Format")
    .custom((val, { req }) => {
      return reviewModel.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error("There is no Review for this ID"));
        }
        if (
          req.user.role === "user" &&
          review.user._id.toString() !== req.user._id.toString()
        ) {
          return Promise.reject(
            new Error("You are not allowed to perform this action")
          );
        }
      });
    }),

  validatorMiddleware,
];
