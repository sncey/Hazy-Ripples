const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    password_hash: {
      type: String,
      required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },
    registered_at: {
      type: Date,
      default: Date.now,
    },
    avatar: {
      type: String,
    },
  });

  userSchema.virtual('fullname').get(function () {
    if (!this.firstname) {
      return this.username;
    } else if (!this.lastname) {
      return this.firstname;
    }
    return `${this.firstname} ${this.lastname}`;
  });

    userSchema.set('toObject', { virtuals: true });
    userSchema.set('toJSON', { virtuals: true });

    module.exports = mongoose.model('User', userSchema);