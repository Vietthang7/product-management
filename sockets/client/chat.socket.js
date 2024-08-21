const streamUpload = require("../../helpers/streamUpload.helper");
const Chat = require("../../models/chat.model");
module.exports = (req, res) => {
  try {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  const roomChatId = req.params.roomChatId;
  //SocketIO
  _io.once('connection', (socket) => {
    socket.join(roomChatId);
    // CLIENT_SEND_MESSAGE
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const chatData = {
        userId: userId,
        content: data.content,
        roomChatId : roomChatId
      };
      const linkImages = [];
      for (const image of data.images) {
        const result = await streamUpload(image);
        linkImages.push(result.url);
      }
      chatData.images = linkImages;
      // Lưu vào database 
      const chat = new Chat(chatData);
      await chat.save();
      // Trả tin nhắn realtime về cho mọi người
      _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: linkImages
      });
    })
    //CLIENT_SEND_TYPING
    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type
      });
    })
  });
  //End SocketIO
  } catch (error) {
    res.redirect("/chat");
  }
  
}