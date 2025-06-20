const attractionModel = require("../models/attractionModel");
const getRecommendationsForUser = require("../utils/getRecommendations");

exports.getAttractionRecommendations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const attractionIds = await getRecommendationsForUser(userId);
    const attractions = await attractionModel.find({ _id: { $in: attractionIds } });

    res.status(200).json({
      status: "success",
      results: attractions.length,
      data: attractions,
    });
  } catch (err) {
    next(err);
  }
};
