const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const attractionModel = require("../models/attractionModel");
const factory = require("./handlersFactory");
const apiError = require("../utils/apiError");
const { uploadMixOfImages } = require("../middleware/imageUpload");
const userModel = require("../models/userModel");

exports.uploadAttractionImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 8 },
]);

exports.resizeAttractionImages = asyncHandler(async (req, res, next) => {
  if (req.files) {
    if (req.files.imageCover) {
      const imageCoverfilename = `attraction-${uuidv4()}-${Date.now()}-cover.jpeg`;
      await sharp(req.files.imageCover[0].buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/attraction/${imageCoverfilename}`);
      req.body.imageCover = imageCoverfilename;
    }
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (image, index) => {
          const imageName = `attraction-${uuidv4()}-${Date.now()}-${
            index + 1
          }.jpg`;
          await sharp(image.buffer)
            .resize(600, 600)
            .toFormat("jpg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/attraction/${imageName}`);

          req.body.images.push(imageName);
        })
      );
    }
  }
  next();
});

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};

exports.createAttraction = factory.createOne(attractionModel, [
  "name",
  "description",
  "category",
  "governorate",
  "district",
  "imageCover",
  "images",
  "location",
  "ratingsAverage",
  "ratingsQuantity",
]);

exports.getAttractions = factory.getAll(attractionModel);

exports.getAttracion = asyncHandler(async (req, res, next) => {
  const attractionId = req.params.id;
  const userId = req.user?._id;

  const attraction = await attractionModel.findById(attractionId);
  if (!attraction) {
    return res.status(404).json({ message: "Attraction not found" });
  }

  if (userId) {
    const user = await userModel.findById(userId);

    // Get last viewed date for this attraction
    const lastViewed = user.lastViewedAttractions?.get(attractionId.toString());

    // Get today's date at 00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isViewedToday = lastViewed && new Date(lastViewed).getTime() >= today.getTime();

    if (!isViewedToday) {
      //Update preferences (+0.2)
      attraction.preferences.forEach((value, key) => {
        const current = user.preferences.get(key) || 0;
        user.preferences.set(key, current + 0.2);
      });

      //Update lastViewedAttractions map
      user.lastViewedAttractions.set(attractionId.toString(), new Date());

      await user.save();
    }
  }

  res.status(200).json({
    message: "Attraction details fetched",
    data: attraction,
  });
});

exports.updateAttraction = factory.updateOne(attractionModel, [
  "name",
  "description",
  "category",
  "governorate",
  "district",
  "imageCover",
  "images",
  "location",
  "ratingsAverage",
  "ratingsQuantity",
]);
// exports.toggleLikeAttraction = asyncHandler(async (req, res, next) => {
//   const userId = req.user._id;
//   const attractionId = req.params.id;

//   const user = await userModel.findById(userId);
//   const attraction = await attractionModel.findById(attractionId);

//   if (!attraction) {
//     return res.status(404).json({ message: "Attraction not found" });
//   }

//   const index = user.likedAttractions.indexOf(attractionId);

//   if (index > -1) {
//     // Attraction is already liked → UNLIKE
//     user.likedAttractions.splice(index, 1);

//     // Remove preferences ONLY if no other liked attraction contains them
//     attraction.preferences.forEach(async (pref) => {
//       const stillNeeded = await attractionModel.exists({
//         _id: { $in: user.likedAttractions },
//         preferences: pref
//       });

//       if (!stillNeeded) {
//         const prefIndex = user.preferences.indexOf(pref);
//         if (prefIndex > -1) {
//           user.preferences.splice(prefIndex, 1);
//         }
//       }
//     });

//     await user.save();
//     return res.status(200).json({ message: "Attraction unliked" });

//   } else {
//     // Attraction not liked → LIKE
//     user.likedAttractions.push(attractionId);

//     // Add preferences (avoid duplicates)
//     attraction.preferences.forEach((pref) => {
//       if (!user.preferences.includes(pref)) {
//         user.preferences.push(pref);
//       }
//     });

//     await user.save();
//     return res.status(200).json({ message: "Attraction liked" });
//   }
// });

// exports.toggleLikeAttraction = asyncHandler(async (req, res, next) => {
//   const userId = req.user._id;
//   const attractionId = req.params.id;

//   const [user, attraction] = await Promise.all([
//     userModel.findById(userId),
//     attractionModel.findById(attractionId),
//   ]);

//   const isLiked = user.likedAttractions.includes(attractionId.toString());

//   const userPreferencesSet = new Set(user.preferences);
//   const attractionPrefs = attraction.preferences;

//   if (isLiked) {
//     // Remove attractionId
//     user.likedAttractions = user.likedAttractions.filter(
//       (id) => id.toString() !== attractionId.toString()
//     );

//     // Remove attraction preferences
//     attractionPrefs.forEach((pref) => userPreferencesSet.delete(pref));

//     user.preferences = Array.from(userPreferencesSet);
//     await user.save();

//     return res.status(200).json({ message: "Attraction unliked" });
//   } else {
//     // Add attractionId
//     user.likedAttractions.push(attractionId);

//     // Add attraction preferences
//     attractionPrefs.forEach((pref) => userPreferencesSet.add(pref));

//     user.preferences = Array.from(userPreferencesSet);
//     await user.save();

//     return res.status(200).json({ message: "Attraction liked" });
//   }
// });

exports.toggleLikeAttraction = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const attractionId = req.params.id;

  const [user, attraction] = await Promise.all([
    userModel.findById(userId),
    attractionModel.findById(attractionId),
  ]);

  const likedIndex = user.likedAttractions.indexOf(attractionId);

  if (likedIndex > -1) {
    user.likedAttractions.splice(likedIndex, 1);

    attraction.preferences.forEach((value, key) => {
      const current = user.preferences.get(key) || 0;
      if (current <= 1) {
        user.preferences.delete(key);
      } else {
        user.preferences.set(key, current - 1);
      }
    });

    await user.save();
    return res.status(200).json({ message: "Attraction unliked" });
  } else {
    user.likedAttractions.push(attractionId);

    attraction.preferences.forEach((value, key) => {
      const current = user.preferences.get(key) || 0;
      user.preferences.set(key, current + 1);
    });
    await user.save();
    return res.status(200).json({ message: "Attraction liked" });
  }
});

exports.deleteAttraction = factory.deleteOne(attractionModel);
