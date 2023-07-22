const express = require("express");
const routes = express.Router();
const OrganizationController = require("../controllers/organization");
const authentication = require("../middleware/authentication");

// routes.get('/', OrganizationController.getOrganizations);
// routes.get('/:id', OrganizationController.getOrganization); //get organization by id
// routes.post('/', OrganizationController.createOrganization);
// routes.put('/:id', OrganizationController.updateOrganization);
// routes.delete('/:id', OrganizationController.deleteOrganization);

// New routes for organization functionalities related to events

// Create an account (organization)
routes.post("/create-account", OrganizationController.createAccount);

// Login to the organization account
routes.post("/login", OrganizationController.login);

// Create an event for the organization
routes.post(
  "/create-event",
  authentication.authMiddleware,
  authentication.isOrganization,
  OrganizationController.createEvent
);

// Get all events created by the organization
routes.get("/:organizationId/events", OrganizationController.getMyEvents);

// Update an event created by the organization
routes.put(
  "/:organizationId/events/:eventId",
  authentication.authMiddleware,
  authentication.isOrganization,
  authentication.isEventOwner,
  OrganizationController.updateEvent
);

// Delete an event created by the organization
routes.delete(
  "/:organizationId/events/:eventId",
  authentication.authMiddleware,
  authentication.isOrganization,
  authentication.isEventOwner,
  OrganizationController.deleteEvent
);

// Update organization details
routes.put(
  "/:organizationId/update-account",
  authentication.authMiddleware,
  authentication.isOrganization,
  OrganizationController.updateAccount
);

// Get users attending the organization's events
routes.get(
  "/:organizationId/attending-users",
  OrganizationController.getAttendingUsers
);

// Notify users attending the organization's events
routes.post(
  "/:organizationId/notify-attending-users",
  OrganizationController.notifyAttendingUsers
);

// Notify users attending the organization's events about event changes
routes.post(
  "/:organizationId/notify-event-changes",
  OrganizationController.notifyEventChanges
);

// Filter events by category
routes.get(
  "/:organizationId/events/filter/category/:category",
  OrganizationController.filterEventsByCategory
);

// Filter events by location
routes.get(
  "/:organizationId/events/filter/location/:location",
  OrganizationController.filterEventsByLocation
);

// Filter events by date
routes.get(
  "/:organizationId/events/filter/date/:date",
  OrganizationController.filterEventsByDate
);

// Search for events
routes.get(
  "/:organizationId/events/search",
  OrganizationController.searchEvents
);

module.exports = routes;
