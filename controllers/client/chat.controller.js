const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
//[GET] /chat 
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  //SocketIO
  _io.once('connection', (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const chatData = {
        userId : userId,
        content : data.content
      };
      // Lưu vào database 
      const chat = new Chat(chatData);
      await chat.save();
      // Trả tin nhắn realtime về cho mọi người
      _io.emit("SERVER_RETURN_MESSAGE",{
        userId : userId,
        fullName : fullName,
        content : data.content
      });
    })
  });
  //End SocketIO
  const chats = await Chat.find({});
  for(const chat of chats){
    const infoUser = await User.findOne({
      _id : chat.userId
    });
    chat.fullName = infoUser.fullName;
  }
  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats : chats
  });
};