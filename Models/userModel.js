const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have name'],
  },
  email: {
    type: String,
    required: [true, 'User must have email'],
  },
  password: {
    type: String,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
});

usersSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const User = mongoose.model('User', usersSchema);

module.exports = User;
