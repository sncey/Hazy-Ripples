const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Organization",
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  },
  is_published: {
    type: Boolean,
    default: false,
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  expired: {
    type: Boolean,
    default: false,
  },
});

function roundToNearest15Minutes(date) {
  const roundedDate = new Date(date);
  const minutes = roundedDate.getMinutes();
  const remainder = minutes % 15;

  if (remainder < 8) {
    roundedDate.setMinutes(minutes - remainder);
  } else {
    roundedDate.setMinutes(minutes + (15 - remainder));
  }

  return roundedDate;
}

// Check if the event is expired
eventSchema.pre("save", function (next) {
  const currentTime = new Date();
  this.start_date = roundToNearest15Minutes(this.start_date);
  this.end_date = roundToNearest15Minutes(this.end_date);
  if (
    (this.isModified("end_date") || this.isNew) &&
    this.end_date < currentTime
  ) {
    return next(new Error("End date cannot be in the past"));
  }

  if (
    (this.isModified("start_date") || this.isNew) &&
    this.start_date < currentTime
  ) {
    return next(new Error("Start date cannot be in the past"));
  }
  if (
    (this.isModified("end_date") ||
      this.isModified("start_date") ||
      this.isNew) &&
    this.end_date < this.start_date
  ) {
    return next(new Error("End date cannot be before start date"));
  }

  next();
});

module.exports = mongoose.model("Event", eventSchema);
