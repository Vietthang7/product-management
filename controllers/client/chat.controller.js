const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");
const chatSocket = require("../../sockets/client/chat.socket");
//[GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  const idUser = req.params.id;
  //SocketIO
  chatSocket(req, res);
  // End SocketIO
  const ChatWithUserModel = await User.findOne({
    _id: idUser
  }).select("fullName");
  let chatWithUser = ChatWithUserModel.fullName;
  const chats = await Chat.find({
    roomChatId: roomChatId
  });
  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.userId
    });
    chat.fullName = infoUser.fullName;
  }
  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
    chatWithUser: chatWithUser
  });
};
module.exports.roomChat = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  const roomChat = await RoomChat.findOne({
    _id:roomChatId
  }).select("title");
  const titleRoomChat = roomChat.title;
  //SocketIO
  chatSocket(req, res);
  // End SocketIO
  const chats = await Chat.find({
    roomChatId: roomChatId
  });
  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.userId
    });
    chat.fullName = infoUser.fullName;
  }
  // console.log(userChat);
  res.render("client/pages/chat/roomchat", {
    pageTitle: "Chat",
    chats: chats,
    titleRoomChat:titleRoomChat
  });
};