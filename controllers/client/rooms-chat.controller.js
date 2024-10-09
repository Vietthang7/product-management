const RoomChat = require("../../models/rooms-chat.model");
const User = require("../../models/user.model");
// [GET] /rooms-chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const listRoomChat = await RoomChat.find({
    typeRoom: "group",
    "users.userId": userId
  });
  res.render("client/pages/rooms-chat/index", {
    pageTitle: "Danh sách phòng",
    listRoomChat: listRoomChat
  });
};
// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendsList = res.locals.user.friendsList;
  for (const friend of friendsList) {
    const infoFriend = await User.findOne({
      _id: friend.userId,
      deleted: false
    }).select("fullName avatar");
    friend.infoFriend = infoFriend;
  }
  res.render("client/pages/rooms-chat/create", {
    pageTitle: "Tạo phòng",
    friendsList: friendsList
  });
};
// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const usersId = req.body.usersId; // Nếu ở form chỉ gửi lên 1 phần tử thì userId nó sẽ không là mảng là nó là phần tử đó luôn
  if (!Array.isArray(usersId)) {
    req.flash("error", "Vui lòng chọn số thành viên trên 1 để tạo phòng chat"),
      res.redirect("back");
    return;
  }
  else {
    let titlenew = "";
    let title = req.body.title;
    if (!title) {
      const users = await User.find({
        deleted: false,
        status: "active",
        _id: { $in: usersId }
      }).select("fullName");
      for (const user of users) {
        titlenew += user.fullName + ",";
      }
      // Loại bỏ dấu phẩy ở cuối chuỗi nếu có  
      if (titlenew.length > 0) {
        titlenew = titlenew.slice(0, -1); // Xóa ký tự cuối cùng (dấu phẩy)  
      }
      title = titlenew;
    }
    const dataRoomChat = {
      title: title,
      typeRoom: "group",
      users: []
    };
    dataRoomChat.users.push({
      userId: res.locals.user.id,
      role: "superAdmin"
    });
    usersId.forEach(userId => {
      dataRoomChat.users.push({
        userId: userId,
        role: "user"
      });
    })
    const roomChat = new RoomChat(dataRoomChat);
    await roomChat.save();
    res.redirect(`/chat/${roomChat.id}`);
  }
};