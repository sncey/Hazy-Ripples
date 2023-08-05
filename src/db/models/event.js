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

// // Pre-save middleware to update the 'expired' property based on end_date
// eventSchema.pre("save", function (next) {
//   const currentTime = new Date();
//   if (this.isModified("end_date") || this.isNew) {
//     // Validate the end_date
//     if (this.end_date < currentTime) {
//       return next(new Error("End date cannot be in the past"));
//     }
//   }
//   if (this.isModified("start_date") || this.isNew) {
//     // Validate the end_date
//     if (this.start_date < currentTime) {
//       return next(new Error("Start date cannot be in the past"));
//     }
//   }
//   next();
// });
eventSchema.pre("save", function (next) {
  const currentTime = new Date();

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

  next();
});

module.exports = mongoose.model("Event", eventSchema);
