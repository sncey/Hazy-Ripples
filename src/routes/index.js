const express = require("express");
const routes = express.Router();
const userRoutes = require("./user");
const eventsRoutes = require("./event");
const organizationRoutes = require("./organization");
const donationRoutes = require("./donation");
const adminRoutes = require("./admin");

routes.use("/user", userRoutes);
routes.use("/events", eventsRoutes);
routes.use("/organization", organizationRoutes);
routes.use("/donation", donationRoutes);
routes.use("/admin", adminRoutes);

module.exports = routes;
