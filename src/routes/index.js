const express = require("express");
const routes = express.Router();
const userRoutes = require("./user");
const eventsRoutes = require("./event");
const organizationRoutes = require("./organization");

routes.use("/user", userRoutes);
routes.use("/events", eventsRoutes);
routes.use("/organization", organizationRoutes);

module.exports = routes;
