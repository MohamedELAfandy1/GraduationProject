const express = require("express");
const router = express.Router();
const {
  getAttractionRecommendations,
} = require("../controllers/recommendationController");
const { auth } = require("../controllers/authController");

// GET /recommendations
router.get("/", auth, getAttractionRecommendations);

module.exports = router;
