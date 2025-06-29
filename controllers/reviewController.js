const asyncHandler = require("express-async-handler");
const reviewModel = require("../models/reviewModel");
const factory = require("./handlersFactory");
const userModel = require("../models/userModel");
const attractionModel = require("../models/attractionModel");
const checkConsistency = require("../utils/checkReviewConsistency");

exports.checkAttractionInBody = asyncHandler(async (req, res, next) => {
  if (req.params.attractionId) {
    req.body.attraction = req.params.attractionId;
  }

  req.body.user = req.user._id;

  next();
});

exports.createFilterObject = asyncHandler(async (req, res, next) => {
  if (req.params.attractionId) {
    const attraction_id = req.params.attractionId;
    req.filterObject = { attraction: attraction_id };
  }
  next();
});

exports.createReview = asyncHandler(async (req, res, next) => {
  const { title, ratings } = req.body;
  const userId = req.user._id;
  const attractionId = req.body.attraction;
  const { consistent, reason } = await checkConsistency(title, ratings);

  if (consistent == true || reason == "cannot determine consistency") {
    const review = await reviewModel.create({
      title,
      ratings,
      user: userId,
      attraction: attractionId,
    });

    const [user, attraction] = await Promise.all([
      userModel.findById(userId),

      attractionModel.findById(attractionId),
    ]);

    attraction.preferences.forEach((value, key) => {
      const current = user.preferences.get(key) || 0;

      let delta = 0;
      if (ratings >= 4) delta = 1;
      else if (ratings === 3) delta = 0.5;
      else if (ratings <= 2) delta = -1;

      const updated = current + delta;
      if (updated <= 0) {
        user.preferences.delete(key);
      } else {
        user.preferences.set(key, updated);
      }
    });

    await user.save();

    res.status(201).json({ message: "Review created", data: review });
  } else {
    console.log("Not Consistent");
    const review = await reviewModel.create({
      title,
      ratings,
      user: userId,
      attraction: attractionId,
    });
    res.status(201).json({ message: "Review created But Its Not Logic", data: review });
  }
});

exports.getReviews = factory.getAll(reviewModel);

exports.getReview = factory.getOne(reviewModel);
//
exports.updateReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;
  const { ratings: newRating, title: newTitle } = req.body;

  const oldReview = await reviewModel.findOneAndUpdate(
    { _id: reviewId, user: req.user._id },
    { ratings: newRating, title: newTitle },
    { new: false }
  );

  if (!oldReview) {
    return res.status(404).json({ message: "Review not found" });
  }

  const [user, attraction] = await Promise.all([
    userModel.findById(req.user._id),
    attractionModel.findById(oldReview.attraction),
  ]);

  if (!user || !attraction) {
    return res.status(400).json({ message: "Invalid user or attraction" });
  }

  // Remove old score
  attraction.preferences.forEach((_, key) => {
    const current = user.preferences.get(key) || 0;
    user.preferences.set(key, current - oldReview.ratings);
  });

  // Add new score
  attraction.preferences.forEach((_, key) => {
    const current = user.preferences.get(key) || 0;
    user.preferences.set(key, current + newRating);
  });

  await user.save();

  res.status(200).json({ message: "Review updated successfully" });
});

exports.deleteReview = factory.deleteOne(reviewModel);
