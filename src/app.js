const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const apiRoutes = require('./routes/index');
const connectToMongo = require("./db/connection");
const session = require('express-session');
require("dotenv").config();

const port = process.env.NODE_LOCAL_PORT || 8080;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Books Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Ceyda",
        url: "https://re-coded.com",
        email: "ceyda666esen@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["'./controllers/userController.js', './swagger.js'"],
};

const specs = swaggerJsdoc(swaggerOptions);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { secure: false }
}));

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.debug(`Server listening on port ${port}`);
  connectToMongo();
})