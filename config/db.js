const mongoose = require("mongoose");
const dbConnection = () => {
    mongoose
    .connect(process.env.DB_URL)
    .then((conn) => {
      console.log("DataBase Connected   ", conn.connection.name);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = dbConnection;
