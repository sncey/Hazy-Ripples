const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const organizationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],

  description: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  rating: {
    type: Number,
  },
});

// Middleware to hash the password before saving the organization
organizationSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    // Generate a salt to hash the password
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the salt
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Set the hashed password as the new value for the 'password' field
    this.password = hashedPassword;

    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("Organization", organizationSchema);
