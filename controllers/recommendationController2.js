const asyncHandler = require("express-async-handler");
const attractionModel = require("../models/attractionModel");
const userModel = require("../models/userModel");
// const factory = require("./handlersFactory");
// const apiError = require("../utils/apiError");

exports.getAttractionRecommendations = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await userModel.findById(userId);

  const attractions = await attractionModel.find();

  const scoredAttractions = attractions
    .map((attraction) => {
      const score = calculateMatchScore(user.preferences, attraction.preferences);
      return { attraction, score };
    })
    .filter(({ score }) => score > 0) 
    .sort((a, b) => b.score - a.score)
  const recommended = scoredAttractions.map(({ attraction }) => attraction);

  res.status(200).json({ recommended });
});


function calculateMatchScore(userPrefs, attractionPrefs) {
  let score = 0;
  for (const pref of attractionPrefs) {
    if (userPrefs.has(pref)) {
      score += userPrefs.get(pref);
    }
  }
  return score;
}
