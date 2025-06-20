const express = require("express");
const {
  getAttractionValidator,
  updateAttractionValidator,
  deleteAttractionValidator,
  createAttractionValidator,
  handleObjects,
  toggleLikeAttractionValidator,
} = require("../utils/validators/attractionValidator.js");

const {
  createAttraction,
  getAttractions,
  getAttracion,
  updateAttraction,
  deleteAttraction,
  uploadAttractionImages,
  resizeAttractionImages,
  createFilterObject,
  toggleLikeAttraction,
} = require("../controllers/attractionController.js");

const { auth, allowedTo } = require("../controllers/authController.js");

const router = express.Router({ mergeParams: true });
router
  .route("/")
  .get(createFilterObject, getAttractions)
  .post(
    auth,
    allowedTo("admin"),
    uploadAttractionImages,
    resizeAttractionImages,
    handleObjects,
    createAttractionValidator,
    createAttraction
  );

router
  .route("/:id")
  .get(auth, getAttractionValidator, getAttracion)
  .put(
    auth,
    allowedTo("admin"),
    uploadAttractionImages,
    resizeAttractionImages,
    handleObjects,
    updateAttractionValidator,
    updateAttraction
  )
  .delete(
    auth,
    allowedTo("admin"),
    deleteAttractionValidator,
    deleteAttraction
  );

router
  .route("/:id/like")
  .post(auth, toggleLikeAttractionValidator, toggleLikeAttraction);

const reviewRoute = require("./reviewRoute.js");
router.use("/:attractionId/reviews", reviewRoute);

module.exports = router;
