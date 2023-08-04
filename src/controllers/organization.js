const OrganizationModel = require("../db/models/organization");
const EventModel = require("../db/models/event");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const welcomeTemplate = require("../emailTemplates/welcome");

const organizationController = {};

const generateJWT = (organization, jwtExp) => {
  return jwt.sign(
    {
      id: organization.id,
      name: organization.name,
      exp: jwtExp,
      iat: Math.floor(Date.now() / 1000), // Issued at date
    },
    process.env.JWT_SECRET
  );
};

const checkErorrCode = (err, res) => {
  if (err.code === 11000) {
    return res
      .status(500)
      .json({ error: `${Object.keys(err.keyValue)} already used` });
  }
  return res.status(400).json({ error: err.message });
};

//Sign Up
organizationController.createAccount = async (req, res) => {
  const jwtExp = Math.floor(Date.now() / 1000) + 86400; // 1 day expiration
  const {
    name,
    email,
    password,
    confirmPassword,
    description,
    phoneNumber,
    image,
  } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    let organization = await OrganizationModel.findOne({ email });

    if (organization) {
      return res.status(400).json({ error: `${email} is already used` });
    }

    organization = await OrganizationModel.create({
      name,
      email,
      password,
      description,
      phoneNumber,
      image,
    });
    // Save the organization
    await organization.save();

    const token = await generateJWT(organization, jwtExp);
    const emailText = welcomeTemplate(organization.name);
    sendEmail(email, "Welcome onboard", emailText);

    res.cookie("jwt", token, { httpOnly: true });
    res.json(token);
  } catch (err) {
    console.log(err)
    checkErorrCode(err, res)
  }
};

//Sign In
organizationController.signin = async (req, res) => {
  const { emailOrUsername, password, rememberMe } = req.body;
  const jwtExp = rememberMe
    ? Math.floor(Date.now() / 1000) + 1209600
    : Math.floor(Date.now() / 1000) + 86400; // 14 days expiration : 1 day expiration
  try {
    const organization = await OrganizationModel.findOne({
      $or: [{ email: emailOrUsername }, { name: emailOrUsername }],
    });
    if (!organization) {
      return res.status(400).json({ error: "Wrong username or password" });
    }

    // Compare the provided password with the hashed password in the organization object
    const passwordMatches = await organization.comparePassword(password);
    if (!passwordMatches) {
      return res.status(400).json({ error: "Wrong username or password" });
    }

    const token = await generateJWT(organization, jwtExp);
    res.cookie("jwt", token, { httpOnly: true });
    res.json(token);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Sign out
organizationController.signout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.redirect("http://localhost:3000/api-docs");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Update organization account
organizationController.updateAccount = async (req, res) => {
  try {
    console.log(req.organization); // Make sure req.organization is properly defined when calling the function
    const { name, email, description, image, phone_number } = req.body;

    // Find the organization by ID
    const updatedOrganization = await OrganizationModel.findById(
      req.organization._id
    );

    if (!updatedOrganization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Update organization details
    updatedOrganization.name = name;
    updatedOrganization.email = email;
    updatedOrganization.description = description;
    updatedOrganization.image = image;
    updatedOrganization.phone_number = phone_number;

    // Save the updated organization
    await updatedOrganization.save();

    res.json({
      message: "Organization details updated successfully",
      organization: updatedOrganization,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error while updating organization details", error });
  }
  
};

// Delete organization account
organizationController.deleteAccount = async (req, res) => {
  const organization = req.organization;
  try {
    // Find the organization by ID
    const deletedOrganization = await OrganizationModel.findByIdAndDelete(
      organization.id
    );

    if (!deletedOrganization) {
      return res.status(404).json({ error: "Organization not found" });
    }
    res.clearCookie("jwt");
    // res.json({ message: "Organization account deleted successfully" });
    res.redirect("http://localhost:3000/api-docs");
  } catch (error) {
    res
      .status(422)
      .json({ error: "Error while deleting organization account" });
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


// Get oranization by id
organizationController.getOrganizationById = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.json(organization);
  } catch (error) {
    res.status(500).json({
      message: "Error while getting organization",
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

// Add a rating for an organization
organizationController.addRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, rating, review } = req.body;

    // Validate rating value (assuming the rating is a number between 1 and 5)
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "Invalid rating value. Please provide a number between 1 and 5.",
      });
    }

    // Find the organization by ID
    const organization = await OrganizationModel.findById(id);

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Update the organization's rating based on the new rating value
    const totalRatings = organization.rating || 0;
    const totalUsersRated = organization.totalUsersRated || 0;
    const newTotalRatings = totalRatings + rating;
    const newTotalUsersRated = totalUsersRated + 1;
    organization.rating = newTotalRatings / newTotalUsersRated;
    organization.totalUsersRated = newTotalUsersRated;

    // Add the rating to the organization's ratings array
    organization.ratings.push({ user, rating, review });
    await organization.save();

    res.json({ message: "Rating added successfully", organization });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error while adding rating for the organization", error });
  }
};

// Get ratings for an organization
organizationController.getRatings = async (req, res) => {
  try {
    const { id } = req.params;

    const organization = await OrganizationModel.findById(id).populate(
      "ratings.user",
      "name"
    ); // Populate user field with user's name

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json(organization.ratings);
  } catch (error) {
    res.status(500).json({ message: "Error while getting ratings", error });
  }
};

module.exports = organizationController;
