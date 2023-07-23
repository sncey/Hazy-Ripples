const OrganizationModel = require("../db/models/organization");
const EventModel = require("../db/models/event");
const organizationController = {};

// organizationController.getOrganizations = async (req, res) => {
//     try {
//         const organizations = await OrganizationModel.find();
//         res.json(organizations);
//     } catch (error) {
//         res.status(500).json({
//             message: 'Error while getting organizations',
//             error
//         });
//     }
// };

// organizationController.getOrganization = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const organization = await OrganizationModel.findById(id);
//         res.json(organization);
//     } catch (error) {
//         res.status(500).json({
//             message: 'Error while getting organization',
//             error
//         });
//     }
// };

// organizationController.createOrganization = async (req, res) => {
//     try {
//         const organization = new OrganizationModel(req.body);
//         await organization.save();
//         res.json({
//             message: 'Organization successfully created',
//             organization
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: 'Error while creating organization',
//             error
//         });
//     }
// };

// organizationController.updateOrganization = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const organization = await


organizationController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the organization by email
    const organization = await OrganizationModel.findOne({ email });

    // If the organization is not found, return an error
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Perform password validation here (You need to implement this logic based on your authentication system)
    // For now, we are just checking if the password matches
    if (password !== organization.password_hash) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If the password is valid, send a success response
    res.json({ message: "Login successful", organization });
  } catch (error) {
    res.status(500).json({
      message: "Error while logging in",
      error,
    });
  }
};

organizationController.createEvent = async (req, res) => {
  try {
    const {
      organizationId,
      eventName,
      eventDate,
      eventLocation,
      eventCategory,
    } = req.body;

    // Check if the organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Create a new event using the EventModel
    const event = new EventModel({
      name: eventName,
      date: eventDate,
      location: eventLocation,
      category: eventCategory,
      createdBy: organizationId,
    });

    // Save the event
    await event.save();

    // Update the organization's events array with the new event
    organization.events.push(event._id);
    await organization.save();

    res.json({
      message: "Event successfully created",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while creating event",
      error,
    });
  }
};

organizationController.getMyEvents = async (req, res) => {
  try {
    const { organizationId } = req.params;

    // Check if the organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Find all events created by the organization
    const events = await EventModel.find({ organizer: organizationId });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error while getting events",
      error,
    });
  }
};

organizationController.updateEvent = async (req, res) => {
  try {
    const { organizationId, eventId, eventDataToUpdate } = req.body;

    // Check if the organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if the event exists and is created by the organization
    const event = await EventModel.findOne({
      _id: eventId,
      organizer: organizationId,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Update the event data
    Object.assign(event, eventDataToUpdate);
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

organizationController.deleteEvent = async (req, res) => {
  try {
    const { organizationId, eventId } = req.params;

    // Check if the organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if the event exists and is created by the organization
    const event = await EventModel.findOne({
      _id: eventId,
      organizer: organizationId,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
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

organizationController.updateAccount = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { name, email, description, phone_number, image } = req.body;

    // Check if the organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Update account details
    if (name) organization.name = name;
    if (email) organization.email = email;
    if (description) organization.description = description;
    if (phone_number) organization.phone_number = phone_number;
    if (image) organization.image = image;

    // Save the updated organization details
    await organization.save();

    res.json({
      message: "Organization account updated successfully",
      organization,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while updating organization account",
      error,
    });
  }
};

organizationController.getAttendingUsers = async (req, res) => {
  try {
    const { organizationId } = req.params;

    // Check if the organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Find all events created by the organization
    const events = await EventModel.find({ organizer: organizationId });

    // Get all users attending the organization's events
    const attendees = await UserModel.find({
      _id: { $in: events.flatMap((event) => event.attendees) },
    });

    res.json(attendees);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching attending users",
      error,
    });
  }
};

organizationController.notifyAttendingUsers = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { message } = req.body;

    // Fetch users attending the organization's events
    const attendees = await organizationController.getAttendingUsers(req, res);

    // Simulate notification for demonstration purposes (You will likely use a notification service or other method in a real application)
    attendees.forEach((user) => {
      console.log(
        `Notifying user ${user.name} (${user.email}) - Message: ${message}`
      );
    });

    res.json({ message: "Notification sent to attending users" });
  } catch (error) {
    res.status(500).json({
      message: "Error while notifying attending users",
      error,
    });
  }
};

organizationController.notifyEventChanges = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { eventId, message } = req.body;

    // Fetch users attending the organization's events
    const attendees = await organizationController.getAttendingUsers(req, res);

    // Simulate notification for demonstration purposes (You will likely use a notification service or other method in a real application)
    attendees.forEach((user) => {
      console.log(
        `Notifying user ${user.name} (${user.email}) about changes to event ${eventId} - Message: ${message}`
      );
    });

    res.json({
      message: "Notification sent to attending users about event changes",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while notifying attending users about event changes",
      error,
    });
  }
};

organizationController.filterEventsByCategory = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { category } = req.query;

    // Check if the organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Find events created by the organization with the specified category
    const events = await EventModel.find({
      organizer: organizationId,
      category,
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error while filtering events by category",
      error,
    });
  }
};

organizationController.filterEventsByLocation = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { location } = req.query;

    // Check if the organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Find events created by the organization with the specified location
    const events = await EventModel.find({
      organizer: organizationId,
      location,
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error while filtering events by location",
      error,
    });
  }
};

organizationController.filterEventsByDate = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { date } = req.query;

    // Check if the organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Find events created by the organization with the specified date
    const events = await EventModel.find({
      organizer: organizationId,
      start_date: { $gte: new Date(date) },
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error while filtering events by date",
      error,
    });
  }
};

organizationController.searchEvents = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { query } = req.query;

    // Check if the organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Find events created by the organization matching the search query in the title or description
    const events = await EventModel.find({
      organizer: organizationId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error while searching for events",
      error,
    });
  }
};

module.exports = organizationController;