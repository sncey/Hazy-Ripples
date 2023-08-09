const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const apiRoutes = require("./routes/index");
const cookieParser = require("cookie-parser");
require("./db/connection");
require("dotenv").config();
const swaggerOptions = require("./swagger/swaggerOptions"); // Import the Swagger options from the separate file
const updateExpiredEvents = require("./utils/updateExpiredEvents");
const path = require("path"); // Import the 'path' module

const port = process.env.NODE_LOCAL_PORT || 8080;

const app = express();

function attachUserToRequest(req, res, next) {
  res.locals.user = req.user;
  next();
}

const middleware = [
  cookieParser(),
  bodyParser.urlencoded({ extended: false }),
  express.json(),
  attachUserToRequest,
];

middleware.forEach((item) => {
  app.use(item);
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerOptions, { explorer: true })
);

// Serve the React frontend build files
app.use(express.static(path.join(__dirname, '../front-end/build')));

// Route for the root URL to serve the React app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../front-end/build/index.html'));
});

app.use("/", apiRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

// Start the cron job
updateExpiredEvents();

module.exports = app;
