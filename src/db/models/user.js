const mongoose = require('mongoose');
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - firstname
 *         - lastname
 *         - email
 *         - phoneNumber
 *         - birthday
 *         - gender
 *       properties:
 *         username:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: number
 *         birthday:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *           enum: [male, female, not-specified]
 *       example:
 *         username: john_doe
 *         firstname: John
 *         lastname: Doe
 *         email: john.doe@example.com
 *         phoneNumber: 1234567890
 *         birthday: "1990-01-01"
 *         gender: male
 */

const userSchema = mongoose.Schema({
  username: {
    type: String ,
    required: true,
    unique: true,
  },
  firstname: {
    type: String ,
    required: true,
  },
  lastname: {
    type: String ,
    required: true,
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
  },
  birthday: {
    type: Date ,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'not-specified'],
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
    unique: true,
    sparse: true
  }, 
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
function validateAge(birthday) {
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  return birthday <= eighteenYearsAgo;
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
  if (this.isModified('birthday') || this.isNew) {
    // Validate the age
    if (!validateAge(this.birthday)) {
      return next(new Error('Age must be at least 18.'));
    }
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
userSchema.virtual('account', {
  ref: 'Account', // Reference to the Accounts collection
  localField: '_id',
  foreignField: 'user',
  justOne: true, // As it's a one-to-one relationship
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);