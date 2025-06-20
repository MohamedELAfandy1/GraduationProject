const authRoute = require("./authRoute.js");
const categoryRoute = require("./categoryRoute.js");
const attractionRoute = require("./attractionRoute.js");
const reviewRoute = require("./reviewRoute.js");
const eventRoute = require("./eventRoute.js");
const userRoute = require("./userRoute.js");
const recommendationRoute = require("./recommendationRoute.js");

const mountRoutes = (app) => {
    app.use("/auth", authRoute);
    app.use("/category", categoryRoute);
    app.use("/attraction", attractionRoute);
    app.use("/reviews", reviewRoute);
    app.use("/event", eventRoute);
    app.use("/user", userRoute);
    app.use("/recommendation", recommendationRoute);
  };

module.exports = mountRoutes;
