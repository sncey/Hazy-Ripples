const mongoose = require('mongoose');
const Event = require('./event');
const bcrypt = require('bcrypt');

//TODO: ADD VALIDATION for email AND AGE
//TODO: MAKE _id And id NOT VISIBLE
const userSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
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
        required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    registered_at: {
      type: Date,
      default: Date.now,
    },
    avatar: {
      type: String,
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    googleId : {
      type: String,
      required: false, 
      unique: true
    }
  });

userSchema.virtual('fullname').get(function () {
  if (!this.firstname) {
    return this.username;
  } else if (!this.lastname) {
    return this.firstname;
  }
  return `${this.firstname} ${this.lastname}`;
});

// Password validation function
function validatePasswordStrength(password) {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
}

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password_hash') || this.isNew) {
    try {
      // Validate the password
      if (!validatePasswordStrength(this.password_hash)) {
        throw new Error(
          'Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long.'
        );
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(this.password_hash, saltRounds);
      this.password_hash = hashedPassword;
      next();
    } catch (err) {
      return next(err);
    }
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password_hash);
};

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);