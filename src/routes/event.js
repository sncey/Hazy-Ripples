const express = require("express");
const routes = express.Router();
const eventController = require("../controllers/event");
const authentication = require("../middleware/authentication");

// Get all events
routes.get("/", eventController.getEvents);

// Get all expired events
routes.get("/expired", eventController.getExpiredEvents);

// Get ordered events (newest or oldest)
routes.get("/ordered", eventController.getOrderedEvents);

// Search for events
routes.get("/search", eventController.searchEventsByQuery);

// Get event by ID
routes.get("/:id", eventController.getEventById);

// Attend an event (authentication required)
routes.post(
  "/attend/:eventId",
  authentication.authMiddleware,
  eventController.attendEvent
);

// Unattend an event (authentication required)
routes.post(
  "/unattend/:eventId",
  authentication.authMiddleware,
  eventController.unattendEvent
);

// Filter events by category
routes.get("/filter/category", eventController.filterEventsByCategory);

// Filter events by location
routes.get("/filter/location", eventController.filterEventsByLocation);

// Filter events by date
routes.get("/filter/date", eventController.filterEventsByDate);

module.exports = routes;
