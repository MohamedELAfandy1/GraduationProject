  const jwt = require("jsonwebtoken");
  const redisClient = require("../config/redis");

  const accessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });
  };

  const refreshToken = async (userId) => {
    try {
      const rt = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1y",
      });
      await redisClient.set(String(userId), JSON.stringify({ rt }), 'EX', 31536000);

    } catch (err) {
      return err;
    }
  };

  module.exports = { accessToken, refreshToken };
