const EventModel = require("../db/models/event");
const OrganizationModel = require("../db/models/organization");
const UserModel = require("../db/models/user");

const adminController = {};
// Admin-only route example
adminController.adminOnlyRoute = (req, res) => {
  res.json({ message: "This is an admin-only route" });
};

// Function to delete a user by ID (admin privilege)
adminController.deleteUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    // Delete the user by the provided user ID
    await UserModel.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting user", error });
  }
};

// Function to update a user by ID (admin privilege)
adminController.updateUserById = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  try {
    // Update the user by the provided user ID
    await UserModel.findByIdAndUpdate(userId, updates);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while updating user", error });
  }
};

// Function to delete an event by ID (admin privilege)
adminController.deleteEventById = async (req, res) => {
  const { eventId } = req.params;

  try {
    // Delete the event by the provided event ID
    await EventModel.findByIdAndDelete(eventId);

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting event", error });
  }
};

// Function to update an event by ID (admin privilege)
adminController.updateEventById = async (req, res) => {
  const { eventId } = req.params;
  const updates = req.body;

  try {
    // Update the event by the provided event ID
    await EventModel.findByIdAndUpdate(eventId, updates);

    res.json({ message: "Event updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while updating event", error });
  }
};

// Function to delete an organization by ID (admin privilege)
adminController.deleteOrganizationById = async (req, res) => {
  const { organizationId } = req.params;

  try {
    // Delete the organization by the provided organization ID
    await OrganizationModel.findByIdAndDelete(organizationId);

    res.json({ message: "Organization deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while deleting organization", error });
  }
};

// Function to update an organization by ID (admin privilege)
adminController.updateOrganizationById = async (req, res) => {
  const { organizationId } = req.params;
  const updates = req.body;

  try {
    // Update the organization by the provided organization ID
    await OrganizationModel.findByIdAndUpdate(organizationId, updates);

    res.json({ message: "Organization updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while updating organization", error });
  }
};

module.exports = adminController;
