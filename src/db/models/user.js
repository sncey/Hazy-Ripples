const mongoose = require("mongoose");

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
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "not-specified"],
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
      ref: "Event",
    },
  ],
  googleId: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// userSchema.set('autoCreate', true);

userSchema.virtual("fullname").get(function () {
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

// Middleware to validate email and age before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("email") || this.isNew) {
    // Validate the email
    if (!validateEmail(this.email)) {
      return next(new Error("Invalid email format."));
    }
  }
  if (this.isModified("birthday") || this.isNew) {
    // Validate the age
    if (!validateAge(this.birthday)) {
      return next(new Error("Age must be at least 18."));
    }
  }
  next();
});

// userSchema.pre('find', function (next) {
//   this.populate('account');
//   next();
// });

// userSchema.pre('findOne', function (next) {
//   this.populate('account');
//   next();
// });

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
userSchema.virtual("account", {
  ref: "Account", // Reference to the Accounts collection
  localField: "_id",
  foreignField: "user",
  justOne: true, // As it's a one-to-one relationship
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
