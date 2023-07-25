const EventModel = require("../db/models/event");
const eventController = {};

eventController.getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error while getting events", error });
  }
};

// Filter events by category
eventController.filterEventsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const events = await EventModel.find({ category });
    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error while filtering events by category",
      error,
    });
  }
};

// Filter events by location
eventController.filterEventsByLocation = async (req, res) => {
  try {
    const { location } = req.query;
    const events = await EventModel.find({ location });
    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error while filtering events by location",
      error,
    });
  }
};

// Filter events by date
eventController.filterEventsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const events = await EventModel.find({
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

eventController.searchEventsByQuery = async (req, res) => {
  try {
    const { query } = req.query;
    const events = await EventModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });
    res.json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while searching for events", error });
  }
};

module.exports = eventController;
