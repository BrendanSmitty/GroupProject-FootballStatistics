const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  favouriteTeam: { type: String, default: null }, // stores team ID
});

module.exports = mongoose.model('User', UserSchema);