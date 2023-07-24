const express = require("express");
const routes = express.Router();
const eventController = require("../controllers/event");
const authentication = require("../middleware/authentication");

// routes.get('/', eventController.getEvents);
// routes.get('/:id', eventController.getEvent); //get event by id
// routes.post('/', authentication.authMiddleware, authentication.isOrganization , eventController.createEvent);
// routes.put('/:id', authentication.authMiddleware, authentication.isOrganization , authentication.isEventOwner,eventController.updateEvent);
// routes.delete('/:id', authentication.authMiddleware, authentication.isOrganization , authentication.isEventOwner,eventController.deleteEvent);

// Route to get all events
routes.get("/", eventController.getEvents);

// Route to get a specific event by ID
routes.get("/:id", eventController.getEvent);

// Route to create a new event (restricted to authenticated organizations)
routes.post(
  "/",
  authentication.authMiddleware,
  authentication.isOrganization,
  eventController.createEvent
);

// Route to update an event (restricted to authenticated organizations that own the event)
routes.put(
  "/:organizationId/events/:eventId",
  authentication.authMiddleware,
  authentication.isOrganization,
  authentication.isEventOwner,
  eventController.updateEvent
);

// Route to delete an event (restricted to authenticated organizations that own the event)
routes.delete(
  "/:organizationId/events/:eventId",
  authentication.authMiddleware,
  authentication.isOrganization,
  authentication.isEventOwner,
  eventController.deleteEvent
);

module.exports = routes;
