const EventModel = require("../db/models/event");
const OrganizationModel = require("../db/models/organization");
const UserModel = require("../db/models/user");

const adminController = {};

// Admin-only route example
adminController.adminOnlyRoute = (req, res) => {
  res.json({ message: "This is an admin-only route" });
};

// User Management (CRUD Operations)
adminController.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error while fetching users", error });
  }
};

adminController.getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error while fetching user", error });
  }
};

adminController.updateUserById = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Error while updating user", error });
  }
};

adminController.deleteUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    await UserModel.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error while deleting user", error });
  }
};

// Function to get all organizations (admin privilege)
adminController.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await OrganizationModel.find();
    res.json(organizations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching organizations", error });
  }
};

// Function to get organization by ID (admin privilege)
adminController.getOrganizationById = async (req, res) => {
  const { organizationId } = req.params;
  try {
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.json(organization);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching organization", error });
  }
};

// Function to create a new organization (admin privilege)
adminController.createOrganization = async (req, res) => {
  const { name, email, description, phoneNumber, image } = req.body;
  try {
    const organization = await OrganizationModel.create({
      name,
      email,
      description,
      phoneNumber,
      image,
    });
    res.json({ message: "Organization created successfully", organization });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while creating organization", error });
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

// Function to get all events (admin privilege)
adminController.getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching events", error });
  }
};

// Function to get event by ID (admin privilege)
adminController.getEventById = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching event", error });
  }
};

// Function to create a new event (admin privilege)
adminController.createEvent = async (req, res) => {
  const { name, date, location, category, createdBy } = req.body;
  try {
    const event = await EventModel.create({
      name,
      date,
      location,
      category,
      createdBy,
    });
    res.json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Error while creating event", error });
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

module.exports = adminController;
