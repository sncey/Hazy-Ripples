const express = require("express");
const routes = express.Router();
const OrganizationController = require("../controllers/organization");
const authentication = require("../middleware/authentication");

// routes.get('/', OrganizationController.getOrganizations);
// routes.post('/', OrganizationController.createOrganization);

// New routes for organization functionalities related to events

// Create an account (organization)
routes.post("/create-account", OrganizationController.createAccount);

// Update organization details
routes.put(
  "/:organizationId/update-account",
  authentication.authMiddleware,
  authentication.isOrganization,
  OrganizationController.updateAccount
);

// Delete organization account
routes.delete(
  "/:organizationId",
  authentication.authMiddleware,
  authentication.isOrganization,
  OrganizationController.deleteAccount
);

// Signin to the organization account
routes.post(
  "/signin",
  authentication.isAuthenticated,
  OrganizationController.signin
);

// Signout from the organization account
routes.post(
  "/signout",
  authentication.authMiddleware,
  OrganizationController.signout
);

// Create an event for the organization
routes.post(
  "/:organizationId/create-event",
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

// Get Organization by ID
routes.get("/:organizationId", OrganizationController.getOrganizationById);

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

// POST route to add a rating for an organization
routes.post(
  "/:organizationId/rate",
  authentication.authMiddleware,
  OrganizationController.addRating
);

// GET route to get ratings for an organization
routes.get("/:organizationId/ratings", OrganizationController.getRatings);

module.exports = routes;
