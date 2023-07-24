const swaggerJsdoc = require("swagger-jsdoc");


const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Hazy Ripples Voluntary platform",
        version: "0.1.0",
        description:
          "This is a simple API documentation made with Swagger to test endpoints functionality",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "Hazy-Ripples",
          url: "https://re-coded.com",
          email: "hazyripples.noreply@gmail.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
    components: {
      schemas: {
        User: {
          $ref: "#/components/schemas/User", // Reference to the User schema defined in the JSDoc comments
        },
        Organization: {
          $ref: "#/components/schemas/Organization", // Reference to the User schema defined in the JSDoc comments
        },
      },
    },
    apis: ["./src/routes/index.js", "./src/db/models/*.js"],
  };

const specs = swaggerJsdoc(swaggerOptions);

module.exports = specs;
