const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  usersSocket(req, res);
  const userId = res.locals.user.id;
  const requestFriend = res.locals.user.requestFriend;
  const acceptFriend = res.locals.user.acceptFriend;
  // $ne: not equal
  // $nin: not in
  const users = await User.find({
    $and : [
      { _id :{$ne :userId}},
      { _id :{$nin :requestFriend}},
      { _id :{$nin :acceptFriend}}
    ],
    status: "active",
    deleted: false
  }).select("id avatar fullName");

  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users
  });
};
// [GET] /users/request
module.exports.request = async (req, res) => {
  usersSocket(req, res);
  const requestFriend = res.locals.user.requestFriend;
  // $in : in
  const users = await User.find({
    _id:{ $in :requestFriend},
    status: "active",
    deleted: false
  }).select("id avatar fullName");

  res.render("client/pages/users/request", {
    pageTitle: "Lời mời đã gửi",
    users: users
  });
};