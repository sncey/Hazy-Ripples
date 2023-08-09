const swaggerJsdoc = require("swagger-jsdoc");
const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      host: "https://hazy-ripples.vercel.app",
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
          url: `${process.env.DOMAIN}`,
        },
      ],
    },
    components: {
      
    },
    apis: ["./src/swagger/controllers/*.js", "./src/swagger/models/*.js"],
    
  };

const specs = swaggerJsdoc(swaggerOptions);
module.exports = specs;