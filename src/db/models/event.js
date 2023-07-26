const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  organizer: {
    type: String,
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
  donations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }],
  expired: {
    type: Boolean,
    default: false,
  },
});

// Pre-save middleware to update the 'expired' property based on end_date
eventSchema.pre("save", function (next) {
  const currentTime = new Date();
  if (this.end_date < currentTime) {
    this.expired = true;
  }
  next();
});

module.exports = mongoose.model("Event", eventSchema);
