const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    phone: String,
    profileImage: String,
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    birthDate: Date,
    location: {
      type: { type: String, default: "Point", required: false },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
        required: false,
      },
    },
    preferences: {
      type: Map,
      of: Number,
      default: {},
    },
    likedAttractions: { type: [mongoose.Schema.ObjectId], ref: "attraction" },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    active: {
      type: Boolean,
      default: true,
    },

    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetCodeExpires: Date,
    passwordResetVerified: Boolean,
    lastViewedAttractions: {
      type: Map,
      of: Date,
      default: {},
    },
  },
  { timestamps: true }
);
userSchema.index({ location: "2dsphere" });

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    if (ret.profileImage && !ret.profileImage.startsWith("http")) {
      ret.profileImage = `${process.env.BASE_URL}/user/${ret.profileImage}`;
    }
    return ret;
  },
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
