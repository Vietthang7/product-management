const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: String,
  content: String,
  images: Array,
  roomChatId: String
}, {
  timestamps: true // Tự động thêm trường createdAt và updatedAt (https://mongoosejs.com/docs/timestamps.html)
});
const Chat = mongoose.model("Chat", chatSchema, "chats");

module.exports = Chat;