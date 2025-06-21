const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/userModel");
const { accessToken, refreshToken } = require("../utils/tokens");
const bcrypt = require("bcrypt");
require("dotenv").config();

const callbackURL =
  process.env.NODE_ENV === "production"
    ? "https://graduationproject-production-01b7.up.railway.app/auth/google/callback"
    : "http://localhost:3000/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,
    },
    async (accessToken, refreshTokenGoogle, profile, done) => {
      try {
        const existingUser = await userModel.findOne({
          email: profile.emails[0].value,
        });
        if (existingUser) return done(null, existingUser);

        const newUser = await userModel.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: await bcrypt.hash("@" + profile.id, 12),
        });

        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
