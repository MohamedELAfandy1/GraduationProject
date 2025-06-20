const mongoose = require("mongoose");

const attractionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "Attraction Must Belong To a Category"],
    },
    governorate: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String, // "Point"
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    imageCover: { type: String, required: true },
    images: [String],
    ratingsAverage: {
      type: Number,
      min: [1, "Rating Must Be Greater Than Or Equal 1"],
      max: [5, "Rating Must Be Smaller Than Or Equal 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    preferences: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

attractionSchema.index({ governorate: 1, district: 1 });
attractionSchema.index({ category: 1 });
attractionSchema.index({ location: "2dsphere" });

attractionSchema.pre(/^find/, function (next) {
  this.populate([{ path: "category", select: "name -_id" }]);
  next();
});

attractionSchema.set("toJSON", {
  transform: function (doc, ret) {
    if (ret.imageCover && !ret.imageCover.startsWith("http")) {
      ret.imageCover = `${process.env.BASE_URL}/attraction/${ret.imageCover}`;
    }

    if (ret.images && Array.isArray(ret.images)) {
      ret.images = ret.images.map((img) =>
        img.startsWith("http")
          ? img
          : `${process.env.BASE_URL}/attraction/${img}`
      );
    }

    return ret;
  },
});
const attractionModel = mongoose.model("attraction", attractionSchema);
module.exports = attractionModel;
