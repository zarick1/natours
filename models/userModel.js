const mongoose = require('mongoose');
const validator = require('validator');

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
  // role: {
  //   type: String,
  //   required: [true, 'User must have role']
  // },
  // active: {
  //   type: Boolean
  // },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'User must have password'],
    minLength: [8, 'Password must have at least 8 characters']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'User must confirm password'],
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: 'Confirmed password must be same as inital password'
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
