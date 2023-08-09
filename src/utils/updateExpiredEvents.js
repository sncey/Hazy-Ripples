const cron = require("node-cron");
const EventModel = require("../db/models/event");

// const updateExpiredEvents = async () => {
//   try {
//     console.log("Running updateExpiredEvents...");
//     const currentTime = new Date();
//     console.log("Current time:", currentTime);

//     // Update the documents and execute the update operation
//     const result = await EventModel.updateMany(
//       { end_date: { $lt: currentTime }, expired: false },
//       { expired: true }
//     ).exec();

//     console.log("Expired events updated. Result:", result);
//   } catch (error) {
//     console.error("Error updating expired events:", error);
//   }
// };

const updateExpiredEvents = async () => {
  try {
    const currentTime = new Date();

    // Update the documents and execute the update operation
    const result = await EventModel.updateMany(
      { end_date: { $lt: currentTime }, expired: false },
      { expired: true }
    ).exec();

    console.log("Expired events updated. Result:", result);
  } catch (error) {
    console.log("Error updating expired events:", error);
  }
};

// Schedule the function to run daily at midnight (0:00)
cron.schedule("*/15 * * * *", () => {
  updateExpiredEvents();
  console.log("Running a task every 15 minute");
});

module.exports = updateExpiredEvents;
