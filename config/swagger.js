const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Registration API",
      version: "1.0.0",
      description: "API for user registration and email OTP verification",
    },
    servers: [
      {
        url: ["http://localhost:3000", "https://graduationproject-production-ebf4.up.railway.app"],
      },
    ],
  },
  apis: ["./routes/*.js", "./swaggerDocs/*.js"], // Adjust path to your routes folder
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
