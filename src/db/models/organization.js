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
  ratings: [
    {
      user: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      review: {
        type: String,
      },
    },
  ],
});

function validatePasswordStrength(password) {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
}

organizationSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    // Validate the password
    if (!validatePasswordStrength(this.password)) {
      return next(
        new Error(
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long."
        )
      );
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
  }
  next();
});

organizationSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Organization", organizationSchema);
