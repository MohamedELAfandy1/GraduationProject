const mongoose = require("mongoose");
const attractionModel = require("./attractionModel");
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: [500, "Title can't exceed 500 characters"],
    },
    ratings: {
      type: Number,
      min: [1, "Min Ratings Value Is 1.0"],
      max: [5, "Max Ratings Value Is 5.0"],
      required: [true, "Review Ratings Required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "Review Must Belong To User"],
    },

    attraction: {
      type: mongoose.Schema.ObjectId,
      ref: "attraction",
      required: [true, "Review Must Belong To Attraction"],
    },

  },

  { timestamps: true }
);

reviewSchema.index({ attraction: 1 });
reviewSchema.index({ attraction: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate([{ path: "user", select: "name" }]);
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  attractionId
) {
  const result = await this.aggregate([
    { $match: { attraction: attractionId } },
    {
      $group: {
        _id: "$attraction",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await attractionModel.findByIdAndUpdate(attractionId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await attractionModel.findByIdAndUpdate(attractionId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.attraction);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatingsAndQuantity(doc.attraction);
  }
});
reviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatingsAndQuantity(doc.attraction);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
