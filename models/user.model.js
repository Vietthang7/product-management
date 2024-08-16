const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  password: String,
  tokenUser: String,
  avatar: String,
  createdBy: String,
  updatedBy: String,
  deletedBy: String,
  status: {
    type: String,
    default: "active"
  },
  deleted: {
    type: Boolean,
    default: false
  },
  acceptFriend: Array,
  requestFriend: Array
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;