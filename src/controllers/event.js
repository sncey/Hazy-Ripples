const EventModel = require("../db/models/event");
const eventController = {};

eventController.getEvents = async (req, res) => {
  try {
    const events = await EventModel.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error while getting events",
      error,
    });
  }
};

eventController.getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await EventModel.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: "Error while getting event",
      error,
    });
  }
};

eventController.createEvent = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { title, description, location, start_date, end_date, image } =
      req.body;

    // Check if the organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Create a new event
    const newEvent = new EventModel({
      title,
      description,
      location,
      start_date,
      end_date,
      organizer: organizationId,
      image,
    });

    // Save the new event
    await newEvent.save();

    // Add the event to the organization's events array
    organization.events.push(newEvent._id);
    await organization.save();

    res.json({
      message: "Event successfully created",
      event: newEvent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while creating event",
      error,
    });
  }
};

eventController.updateEvent = async (req, res) => {
  try {
    const { organizationId, eventId } = req.params;
    const { title, description, location, start_date, end_date, image } =
      req.body;

    // Check if the organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Find the event to be updated
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the organization is the owner of the event
    if (!event.organizer.equals(organization._id)) {
      return res
        .status(403)
        .json({ message: "Forbidden. Not the owner of the event" });
    }

    // Update event details
    if (title) event.title = title;
    if (description) event.description = description;
    if (location) event.location = location;
    if (start_date) event.start_date = start_date;
    if (end_date) event.end_date = end_date;
    if (image) event.image = image;

    // Save the updated event details
    await event.save();

    res.json({
      message: "Event successfully updated",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while updating event",
      error,
    });
  }
};

eventController.deleteEvent = async (req, res) => {
  try {
    const { organizationId, eventId } = req.params;

    // Check if the organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Find the event to be deleted
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the organization is the owner of the event
    if (!event.organizer.equals(organization._id)) {
      return res
        .status(403)
        .json({ message: "Forbidden. Not the owner of the event" });
    }

    // Remove the event from the organization's events array
    organization.events = organization.events.filter(
      (eventId) => String(eventId) !== String(event._id)
    );
    await organization.save();

    // Delete the event from the EventModel collection
    await event.remove();

    res.json({ message: "Event successfully deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Error while deleting event",
      error,
    });
  }
};

module.exports = eventController;
