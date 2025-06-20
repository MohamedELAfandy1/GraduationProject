  const mongoose = require("mongoose");
  const eventSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Event Name Is Required"],
      },
      description: String,

      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
        default: Date.now,
        validate: {
          validator: function (value) {
            return !value || value >= this.startDate;
          },
          message: "End date must be after or equal to start date",
        },
      },

      status: {
        type: String,
        enum: ["upcoming", "finished", "cancelled"],
          default: "upcoming"
      },

      governorate: {
        type: String,
      },
      district: {
        type: String,
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

      images: [String],
      categories: [String],
      organizer: {
        name: String,
        contact: String,
        website: String,
      },
      price: {
        type: Number,
        default: 0,
      },
      capacity: {
        type: Number,
        min: [1, "Capacity must be at least 1"],
      },
    },
    { timestamps: true }
  );

  eventSchema.index({ location: "2dsphere" });
  const eventModel = mongoose.model("event", eventSchema);

  module.exports = eventModel;
