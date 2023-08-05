const EventModel = require("../db/models/event");
const UserModel = require("../db/models/user");
const eventController = {};

// Get only non-expired events
eventController.getEvents = async (req, res) => {
  try {
    // Filter out expired events by adding { expired: false } to the query
    const events = await EventModel.find({ expired: false }).populate(
      "organizer"
    );
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error while fetching events" });
  }
};
// Get all expired events
eventController.getExpiredEvents = async (req, res) => {
  try {
    const currentTime = new Date();
    const events = await EventModel.find({
      end_date: { $lt: currentTime },
      expired: true,
    }).sort({ start_date: -1 }); // Sort by start_date in descending order (latest events first)
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get ordered events (newest or oldest based on the query)
eventController.getOrderedEvents = async (req, res) => {
  try {
    const { order } = req.params;
    const query = { expired: false };
    // Add sorting criteria to the query based on 'order' parameter
    const sortingCriteria =
      order === "newest" ? { start_date: -1 } : { start_date: 1 };
    const events = await EventModel.find(query)
      .sort(sortingCriteria)
      .populate("organizer");
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error while fetching events" });
  }
};

// Get event by ID
eventController.getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await EventModel.findById(eventId).populate("organizer");
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Error while fetching event" });
  }
};

// Attend an event
eventController.attendEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    // Check if the event exists and is not expired
    const event = await EventModel.findById(eventId);
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!event || event.expired) {
      return res
        .status(404)
        .json({ message: "Event not found or has already expired" });
    }
    // Check if the user is already attending the event
    if (user.events?.includes(eventId)) {
      return res
        .status(400)
        .json({ message: "You are already attending this event" });
    }

    // Add the event to the user's events array
    user.events.push(eventId);
    await user.save();
    // Add the user to the event's attendees array
    event.attendees.push(user._id);
    await event.save();
    res.json({ message: "You are now attending the event", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Unattend an event
eventController.unattendEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    // Check if the event exists and is not expired
    const event = await EventModel.findById(eventId);
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!event || event.expired) {
      return res
        .status(404)
        .json({ message: "Event not found or has already expired" });
    }
    // Check if the user is attending the event
    if (!user.events.includes(eventId)) {
      return res
        .status(400)
        .json({ message: "You are not attending this event" });
    }
    // Remove the event from the user's events array
    user.events = user.events.filter((eId) => eId.toString() !== eventId);
    await user.save();
    // Remove the user from the event's attendees array
    event.attendees = event.attendees.filter(
      (userId) => userId.toString() !== user._id.toString()
    );
    await event.save();
    res.json({ message: "You have unattended the event", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Filter events by category (case-insensitive)
eventController.filterEventsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const regex = new RegExp(category, "i"); // 'i' flag makes it case-insensitive
    const events = await EventModel.find({
      category: { $regex: regex },
      expired: false,
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error while filtering events by category",
      error,
    });
  }
};

// Filter events by location (case-insensitive)
eventController.filterEventsByLocation = async (req, res) => {
  try {
    const { location } = req.query;
    const regex = new RegExp(location, "i"); // 'i' flag makes it case-insensitive
    const events = await EventModel.find({
      location: { $regex: regex },
      expired: false,
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error while filtering events by location",
      error,
    });
  }
};

eventController.filterEventsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Convert query parameters to JavaScript Date objects
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    endDateTime.setDate(endDateTime.getDate() + 1); // Add one day to include events on the end date

    // Check if the date formats are valid
    if (isNaN(startDateTime) || isNaN(endDateTime)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Convert dates to ISO 8601 format
    const isoStartDate = startDateTime.toISOString();
    const isoEndDate = endDateTime.toISOString();

    // Filter events using explicit date comparison with ISO 8601 formatted dates
    const events = await EventModel.find({
      start_date: { $gte: isoStartDate },
      end_date: { $lt: isoEndDate },
      expired: false,
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error while filtering events by date",
      error,
    });
  }
};
eventController.searchEventsByQuery = async (req, res) => {
  try {
    const { query, startDate } = req.query;
    const lowerCaseQuery = query.toLowerCase();
    const regex = new RegExp(lowerCaseQuery, "i"); // 'i' flag makes it case-insensitive

    // Convert startDate to a Date object
    const parsedStartDate = startDate ? new Date(startDate) : null;

    let events;
    if (parsedStartDate) {
      events = await EventModel.find({
        $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
        start_date: { $gte: parsedStartDate }, // Filter events with start_date greater than or equal to parsedStartDate
      });
    } else {
      events = await EventModel.find({
        $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
      });
    }

    res.json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while searching for events", error });
  }
};

module.exports = eventController;
