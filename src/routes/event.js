const express = require("express");
const routes = express.Router();
const eventController = require("../controllers/event");
const authentication = require("../middleware/authentication");

// routes.get('/', eventController.getEvents);
// routes.get('/:id', eventController.getEvent); //get event by id
// routes.post('/', authentication.authMiddleware, authentication.isOrganization , eventController.createEvent);
// routes.put('/:id', authentication.authMiddleware, authentication.isOrganization , authentication.isEventOwner,eventController.updateEvent);
// routes.delete('/:id', authentication.authMiddleware, authentication.isOrganization , authentication.isEventOwner,eventController.deleteEvent);

// Get all events
routes.get("/", eventController.getAllEvents);

// Filter events by category
routes.get("/filter/category", eventController.filterEventsByCategory);

// Filter events by location
routes.get("/filter/location", eventController.filterEventsByLocation);

// Filter events by date
routes.get("/filter/date", eventController.filterEventsByDate);

// Search for events
routes.get("/search", eventController.searchEventsByQuery);

module.exports = routes;
