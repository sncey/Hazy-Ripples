// const mongoose = require("mongoose");
// require("dotenv").config();
// const url = process.env.DB_URL;

// const connectToMongo = () => {
//   mongoose.connect(url, { useNewUrlParser: true });

//   db = mongoose.connection;

//   db.once("open", () => {
//     console.log("Database connected: ", url);
//   });

//   db.on("error", (err) => {
//     console.error("Database connection error: ", err);
//   });
// }

// module.exports = connectToMongo;

const mongoose = require("mongoose");
require("dotenv").config();

// Retrieve the MongoDB connection URI from the environment variables
const mongoURI = process.env.MONGO_URI;

const connectToMongo = () => {
// Establish a connection to the database
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
};

// Export the database connection
module.exports = connectToMongo;
