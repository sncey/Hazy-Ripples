const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: {
      type: String ,
      required: true,
      unique: true,
    },
    firstname: {
      type: String ,
      required: true,
      default: " "
    },
    lastname: {
      type: String ,
      required: true,
      default: {}
    },
    password_hash: {
      type: String ,
      required: true,
      default: {}
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
      type: Number ,
      required: true,
      unique: true,
      default: {}
  },
    age: {
        type: Number ,
        required: true,
        default: {}
    },
    gender: {
      type: String || null,
      enum: ['male', 'female', 'not-specified'],
      required: true,
      default: {}
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
      // unique: true
    }, 
    // verified : {
    //   type: Boolean,
    //   default : false,
    // }
  });

  // userSchema.set('autoCreate', true);

userSchema.virtual('fullname').get(function () {
  if (!this.firstname) {
    return this.username;
  } else if (!this.lastname) {
    return this.firstname;
  }
  return `${this.firstname} ${this.lastname}`;
});

// Email validation function
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Age validation function
function validateAge(age) {
  return age >= 18;
}

// Password validation function
function validatePasswordStrength(password) {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
}


// userSchema.pre('save', async function (next) {
//   if (this.isModified('password_hash') || this.isNew) {
//     try {
//       // Validate the password
//       if (!validatePasswordStrength(this.password_hash)) {
//         throw new Error(
//           'Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long.'
//         );
//       }
//       const saltRounds = 10;
//       const hashedPassword = await bcrypt.hash(this.password_hash, saltRounds);
//       this.password_hash = hashedPassword;
//       next();
//     } catch (err) {
//       return next(err);
//     }
//   } else {
//     next();
//   }
// });

// Middleware to validate email and age before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('email') || this.isNew) {
    // Validate the email
    if (!validateEmail(this.email)) {
      return next(new Error('Invalid email format.'));
    }
  }

  if (this.isModified('age') || this.isNew) {
    // Validate the age
    if (!validateAge(this.age)) {
      return next(new Error('Age must be at least 18.'));
    }
  }

  if (this.isModified('password_hash') || this.isNew) {
    // Validate the password
    if (!validatePasswordStrength(this.password_hash)) {
      return next(
        new Error(
          'Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long.'
        )
      );
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(this.password_hash, saltRounds);
    this.password_hash = hashedPassword;
  }

  next();
});

/*
In the above code, we added two custom validation functions:
validateEmail(email) and validateAge(age). 
The validateEmail() function uses a regular expression to check
if the email format is valid. The validateAge() function ensures 
that the age is at least 18.

Inside the pre('save') middleware, we call these validation 
functions when a new user is being created or when the email or 
age fields are modified. If any of the validations fail, 
we return an error using next(new Error(...)), which will 
prevent the user from being saved.
*/
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password_hash);
};

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);