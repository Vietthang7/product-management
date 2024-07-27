const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expireAt: {
    type: Date,
    expires: 0
  }
}, {
  timestamps: true // Tự động thêm trường createdAt và updatedAt (https://mongoosejs.com/docs/timestamps.html)
});
const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-password");

module.exports = ForgotPassword;