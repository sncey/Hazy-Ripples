const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const accountSchema = mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    password_hash: {
      type: String ,
      required: true,
    },
});

function validatePasswordStrength(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
}

accountSchema.pre('save', async function (next) {
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

accountSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password_hash);
};
  
module.exports = mongoose.model('Account', accountSchema);