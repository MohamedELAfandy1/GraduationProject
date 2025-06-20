const express = require("express");
const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,

  createFilterObject,
  checkAttractionInBody,
} = require("../controllers/reviewController");
const { auth, allowedTo } = require("../controllers/authController");

const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObject, getReviews)
  .post(
    auth,
    allowedTo("user"),
    checkAttractionInBody,
    createReviewValidator,
    createReview
  );

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(auth, allowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    auth,
    allowedTo("admin", "user"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
