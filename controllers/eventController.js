const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const eventModel = require("../models/eventModel");
const factory = require("./handlersFactory");
const apiError = require("../utils/apiError");
const { uploadMixOfImages } = require("../middleware/imageUpload");

exports.uploadEventImages = uploadMixOfImages([
  { name: "images", maxCount: 8 },
]);

exports.resizeEventImages = asyncHandler(async (req, res, next) => {
  if (req.files) {
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (image, index) => {
          const imageName = `event-${uuidv4()}-${Date.now()}-${index + 1}.jpg`;
          await sharp(image.buffer)
            .resize(600, 600)
            .toFormat("jpg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/event/${imageName}`);

          req.body.images.push(imageName);
        })
      );
    }
  }
  next();
});

exports.createEvent = factory.createOne(eventModel, [
  "name",
  "description",
  "startDate",
  "endDate",
  "status",
  "governorate",
  "district",
  "location",
  "images",
  "categories",
  "organizer",
  "price",
  "capacity",
]);

exports.getEvents = factory.getAll(eventModel);

exports.getEvent = factory.getOne(eventModel);

exports.updateEvent = factory.updateOne(eventModel, [
  "name",
  "description",
  "startDate",
  "endDate",
  "status",
  "governorate",
  "district",
  "location",
  "images",
  "categories",
  "organizer",
  "price",
  "capacity",
]);

exports.deleteEvent = factory.deleteOne(eventModel);
