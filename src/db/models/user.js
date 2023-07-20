const mongoose = require('mongoose');
const Event = require('./event');

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

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);