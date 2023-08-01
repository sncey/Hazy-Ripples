const express = require("express");
const routes = express.Router();
const adminController = require("../controllers/admin");
const authentication = require("../middleware/authentication");

// Admin-only route example
routes.get(
  "/admin-only",
  //   authentication.isAdminMiddleware,
  adminController.adminOnlyRoute
);

// Routes for managing users (admin privilege)
routes.delete(
  "/users/:userId",
  authentication.isAdminMiddleware,
  adminController.deleteUserById
);
routes.put(
  "/users/:userId",
  authentication.isAdminMiddleware,
  adminController.updateUserById
);

// Routes for managing events (admin privilege)
routes.delete(
  "/events/:eventId",
  authentication.isAdminMiddleware,
  adminController.deleteEventById
);
routes.put(
  "/events/:eventId",
  authentication.isAdminMiddleware,
  adminController.updateEventById
);

// Routes for managing organizations (admin privilege)
routes.delete(
  "/organizations/:organizationId",
  authentication.isAdminMiddleware,
  adminController.deleteOrganizationById
);
routes.put(
  "/organizations/:organizationId",
  authentication.isAdminMiddleware,
  adminController.updateOrganizationById
);

module.exports = routes;
