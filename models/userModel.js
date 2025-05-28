const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Define the Mongoose schema for the User model
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have name']
  },
  email: {
    type: String,
    required: [true, 'User must have email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user'
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  // photo: {
  //   type: String
  // },
  password: {
    type: String,
    required: [true, 'User must have password'],
    minLength: [8, 'Password must have at least 8 characters'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'User must confirm password'],
    validate: {
      // Only works on SAVE
      validator: function (val) {
        return this.password === val;
      },
      message: 'Passwords are not the same'
    }
  },
  passwordChangedAt: {
    type: Date
  },
  passwordResetToken: String,
  passwordResetExpires: Date
});

// Pre-save middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

// Pre-save middleware to update passwordChangedAt timestamp
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Pre-find middleware to exclude inactive users from query results
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Instance method to compare a candidate password with the stored hashed password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if password was changed after a given JWT timestamp
userSchema.methods.changePasswordAfter = function (JWTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTimeStamp < changedTimeStamp;
  }

  return false;
};

// Instance method to generate a password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Create and export the User model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
