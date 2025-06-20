const redis = require("ioredis");
require("dotenv").config();

const client = new redis({
  host: process.env.REDIS_END_POINT,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  tls: {},
});

client.on("connect", () => console.error("Client Connected To Redis"));
client.on("error", (err) => console.error("Redis Error", err));

module.exports = client;
