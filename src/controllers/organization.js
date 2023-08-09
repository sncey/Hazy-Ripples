const OrganizationModel = require("../db/models/organization");
const EventModel = require("../db/models/event");
const UserModel = require('../db/models/user')
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
    res.cookie("jwt", token, { httpOnly: false });
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
    res.cookie("jwt", token, { httpOnly: false });
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
// Create an Event
organizationController.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      category,
      start_date,
      end_date,
      image,
    } = req.body;

    // Check if the organization exists
    const organization = await OrganizationModel.findById(req.organization.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Create a new event using the EventModel
    const event = new EventModel({
      title,
      organizer: organization._id, // Assign the organization's ID as the organizer
      description,
      location,
      category,
      start_date,
      end_date,
      image,
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
      error: error.message
    });
  }
};
// Gets every events from the organizationId
organizationController.getOrganizationEvents = async (req, res) => {
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
// Updates an existing event
organizationController.updateEvent = async (req, res) => {
  try {
    const eventId = req.eventId
    const {
      title,
      description,
      location,
      category,
      start_date,
      end_date,
      image,

    } = req.body;
    // Check if the organization exists
    const organization = await OrganizationModel.findById(req.organization.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    // Check if the event exists and is created by the organization
    const event = await EventModel.findOne({
      _id: eventId,
      organizer: organization.id,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    // Update the event data
    //Object.assign(event, eventDataToUpdate);
    
    event.title=title,
    event.description=description,
    event.location=location,
    event.category=category,
    event.start_date=start_date,
    event.end_date=end_date,
    event.image=image,

    await event.save();
    res.json({
      message: "Event successfully updated",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while updating event",
      error: error.message,
    });
  }
};
// Deletes an existing event
organizationController.deleteEvent = async (req, res) => {
  try {
    const {eventId} = req.eventId

    // Check if the organization exists
    const organization = await OrganizationModel.findById(req.organization.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    // Check if the event exists and is created by the organization
    const event = await EventModel.findOne({
      id: eventId,
      organizer: organization.id,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    // Remove the event from the organization's events array
    const deletedEvent = await EventModel.findById(event._id);
    if (!deletedEvent) {
      return res.json({ message: "Event has already been deleted" });
    }

    // Delete the event from the EventModel collection
    await EventModel.deleteOne({ _id: event._id });

    res.json({ message: "Event successfully deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Error while deleting event",
      error: error.message,
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
organizationController.getAttendingUsersOfOrgEvents = async (req, res) => {
  try {
    const { organizationId } = req.params;
    // Check if the organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    // Find all events created by the organization
    const events = await EventModel.find({ organizer: organizationId });
    if (events.length === 0) {
      return res.status(404).json({ message: "Events not found" });
    }
    // Fetch attendees for each event
    const eventsWithAttendees = await Promise.all(
      events.map(async (event) => {
        const attendees = await UserModel.find(
          { _id: { $in: event.attendees } },
          { username: 1 }
        ).lean();

        return {
          eventName: event.title, // Use 'title' field as the event name
          attendees: attendees.map((user) => user.username),
        };
      })
    );

    res.json(eventsWithAttendees);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching attending users",
      error,
    });
  }
};
organizationController.notifyAttendingUsers = async (req, res) => {
  try {
    const organization  = req.organization;
    const { message } = req.body;

    const events = await EventModel.find({ organizer: organization.id });
    if (events.length === 0) {
      return res.status(404).json({ message: "Events not found" });
    }

    const attendees = await UserModel.find({
      _id: { $in: events.flatMap((event) => event.attendees) },
    });

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
    const eventId = req.eventId
    const { message } = req.body;

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    // Fetch users attending the organization's events
    const attendees = await UserModel.find({
      _id: { $in: event.attendees },
    });
    // Simulate notification for demonstration purposes (You will likely use a notification service or other method in a real application)
    attendees.forEach((user) => {
      console.log(
        `Notifying user ${user.username} (${user.email}) about changes to event ${eventId} - Message: ${message}`
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
organizationController.filterEvents = async (req, res) => {
  try {
    const organizationId = req.organization.id;
    const { category, location, date } = req.query;
    
    // Create a base query with the common filter for the organization and not expired events
    const baseQuery = {
      organizer: organizationId,
      expired: false,
    };

    // Add additional filters based on the provided query parameters
    if (category) {
      const regex = new RegExp(category, "i");
      baseQuery.category = regex;
    }

    if (location) {
      baseQuery.location = location;
    }

    if (date) {
      baseQuery.start_date = { $gte: new Date(date) };
    }

    // Find events based on the combined query
    const events = await EventModel.find(baseQuery);

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "Events not found" });
    }

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error while filtering events",
      error: error.message,
    });
  }
};
organizationController.searchEvents = async (req, res) => {
  try {
    const  organizationId  = req.organization.id;
    const { query } = req.query;
    
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
    const {organizationId} = req.params
    const { rating, review } = req.body;
    const user = req.user
    // Validate rating value (assuming the rating is a number between 1 and 5)
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "Invalid rating value. Please provide a number between 1 and 5.",
      });
    }
    // Find the organization by ID
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }
    
    // Add the rating to the organization's ratings array
    organization.ratings.push({ user: user.username, rating, review });
    await organization.save();
    res.json({ message: "Rating added successfully", ratings: organization.ratings, });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error while adding rating for the organization", error: error.message });
  }
};
// Get ratings for an organization
organizationController.getRatings = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const organization = await OrganizationModel.findById(organizationId)
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const ratings = organization.ratings;
    if (ratings.length === 0) {
      // If there are no ratings, return 0 as the average
      return res.json("There is no previews rating of this organization, feel free to leave a review");
    }

    // Calculate the total sum of ratings
    const totalRatings = ratings.reduce((sum, ratingObj) => sum + ratingObj.rating, 0);

    // Calculate the average rating
    const average = totalRatings / ratings.length;

    res.json({ average, ratings });
  } catch (error) {
    res.status(500).json({ message: "Error while getting ratings", error: error.message });
  }
};
module.exports = organizationController;