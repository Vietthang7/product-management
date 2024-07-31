const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  websiteName: String,
  logo: String,
  phone: String,
  email: String,
  address: String,
  copyright: String
}, {
  timestamps: true // Tự động thêm trường createdAt và updatedAt (https://mongoosejs.com/docs/timestamps.html)
});
const Setting = mongoose.model('Setting', settingSchema, "settings");

module.exports = Setting;