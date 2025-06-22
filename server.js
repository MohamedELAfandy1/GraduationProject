const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const passport = require("passport");
const hpp = require("hpp");
const cors = require("cors");
const compression = require("compression");

const mountRoutes  = require("./routes/indexRoute");

require("dotenv").config();
require("./config/db")();
require("./config/passport");
const swaggerSpec = require("./config/swagger"); // Adjust path

const app = express();

app.use(cors());
app.use(compression());

app.use(express.json({ limit: 2 * 1024 * 1024 }));
app.use(express.urlencoded({ extended: true, limit: 2 * 1024 * 1024 }));

app.use(hpp({ whitelist: [ 'filter','sort', 'keyword', 'fields', 'limit','page' ]} ));

app.use(passport.initialize());
app.use(express.static(path.join(__dirname, "uploads")));

mountRoutes(app);
app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(async (req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status = err.status || 500;
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Connected On ${PORT}`);
});
