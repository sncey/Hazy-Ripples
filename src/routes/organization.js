const express = require("express");
const routes = express.Router();
const OrganizationController = require("../controllers/organization");
const authentication = require("../middleware/authentication");

// routes.get('/', OrganizationController.getOrganizations);
// routes.post('/', OrganizationController.createOrganization);

// New routes for organization functionalities related to events

// Create an account (organization)
routes.post("/signup", authentication.isAuthenticated, OrganizationController.createAccount);

// Signin to the organization account
routes.post(
  "/signin",
  authentication.isAuthenticated,
  OrganizationController.signin
);

//Sign out from Organization account
routes.post("/signOut", authentication.authMiddleware, authentication.isOrganization, OrganizationController.signout)


// PUBLIC Get Organization by ID
routes.get("/:organizationId", OrganizationController.getOrganizationById);

// PUBLIC Get all events created by the organization
routes.get("/:organizationId/events", OrganizationController.getOrganizationEvents);

// Update organization details
routes.put(
  "/updateAccount",
  authentication.authMiddleware,
  authentication.isOrganization,
  OrganizationController.updateAccount
);

// Delete organization account
routes.delete(
  "/",
  authentication.authMiddleware,
  authentication.isOrganization,
  OrganizationController.deleteAccount
);

// Create an event for the organization
routes.post(
  "/createEvent",
  authentication.authMiddleware,
  authentication.isOrganization,
  OrganizationController.createEvent
);

// Update an event created by the organization
routes.put(
  "/events/:eventId",
  authentication.authMiddleware,
  authentication.isOrganization,
  authentication.isEventOwner,
  OrganizationController.updateEvent
);

// Delete an event created by the organization
routes.delete(
  "/events/:eventId",
  authentication.authMiddleware,
  authentication.isOrganization,
  authentication.isEventOwner,
  OrganizationController.deleteEvent
);


// PUBLIC Get users attending the organization's events
routes.get(
  "/:organizationId/attending-users",
  OrganizationController.getAttendingUsersOfOrgEvents
);

// Notify users attending the organization's events
routes.post(
  "/notify-attending-users",
  authentication.authMiddleware,
  authentication.isOrganization,
  OrganizationController.notifyAttendingUsers
);

// Notify users attending the organization's events about event changes
routes.post(
  "/:eventId/notify-event-changes",
  authentication.authMiddleware,
  authentication.isOrganization,
  authentication.isEventOwner,
  OrganizationController.notifyEventChanges
);

// Filter events by category, location and dates
routes.get(
  "/events/filter",
  authentication.authMiddleware,
  authentication.isOrganization,
  OrganizationController.filterEvents
);

// Search for events
routes.get(
  "/events/search",
  authentication.authMiddleware,
  authentication.isOrganization,
  OrganizationController.searchEvents
);

// POST route to add a rating for an organization
routes.post(
  "/rate/:organizationId",
  authentication.authMiddleware,
  OrganizationController.addRating
);

// GET route to get ratings for an organization
routes.get("/rating/:organizationId", OrganizationController.getRatings);

module.exports = routes;