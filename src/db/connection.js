const mongoose = require("mongoose");
require("dotenv").config();

// Retrieve the MongoDB connection URI from the environment variables
const mongoURI = process.env.MONGO_URI;

// Establish a connection to the database
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

// Get the default connection
const db = mongoose.connection;

// Event listeners for the connection events
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

// Export the database connection
module.exports = db;
