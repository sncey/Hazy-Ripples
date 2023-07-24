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

eventController.getAllEventCategories = async (req, res) => {
  try {
    const categories = await EventModel.distinct("category");
    res.json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while getting event categories", error });
  }
};

eventController.getAllEventLocations = async (req, res) => {
  try {
    const locations = await EventModel.distinct("location");
    res.json(locations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while getting event locations", error });
  }
};

eventController.getAllEventDates = async (req, res) => {
  try {
    const dates = await EventModel.distinct("start_date");
    res.json(dates);
  } catch (error) {
    res.status(500).json({ message: "Error while getting event dates", error });
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
