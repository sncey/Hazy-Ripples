const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  amount: Number,
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  date: { type: Date, default: Date.now }
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;