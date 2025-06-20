const bouncer = require("express-bouncer")(500000, 600000, 10);

bouncer.blocked = function (req, res, next) {
  res.status(429).json({ message: "Too Many Attempts. Try Again Later" });
};

module.exports = bouncer; 