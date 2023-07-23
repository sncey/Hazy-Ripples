const EventModel = require('../db/models/event');
const eventController = {};

// eventController.getEvents = async (req, res) => {
//     try {
//         const events = await EventModel.find();
//         res.json(events);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

// eventController.getEvent = async (req, res) => {
//     try {
//         const event = await EventModel.findById(req.params.id);
//         res.json(event);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

// eventController.createEvent = async (req, res) => {
//     try {
//         const event = await EventModel.create({
//             name: req.body.name,
//             description: req.body.description,
//             location: req.body.location,
//             date: req.body.date,
//             time: req.body.time,
//             organization: req.organization._id
//         });
//         res.json({ success: true, event });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

// eventController.updateEvent = async (req, res) => {
//     try {
//         const event = await EventModel.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
//         if (!event) {
//             return res.status(404).json({ error: 'Event not found!' });
//         }
//         res.json({ success: true, event });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

// eventController.deleteEvent = async (req, res) => {
//     try {
//         const event = await EventModel.findByIdAndDelete(req.params.id);
//         if (!event) {
//             return res.status(404).json({ error: 'Event not found!' });
//         }
//         res.json({ success: true, event });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

module.exports = eventController;