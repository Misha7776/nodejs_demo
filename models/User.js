const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  roles: {
    User: {
      type: Number,
      default: 5152
    },
    Editor: {
      type: Number
    },
    Admin: {
      type: Number
    }
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: false
  },
})

module.exports = mongoose.model('User', userSchema);