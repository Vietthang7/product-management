const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  usersSocket(req, res);
  const userId = res.locals.user.id;
  const requestFriends = res.locals.user.requestFriends;
  const acceptFriends = res.locals.user.acceptFriends;
  const friendsList = res.locals.user.friendsList;
  const friendsListId = friendsList.map(item => item.userId);
  // $ne: not equal
  // $nin: not in
  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
      { _id: { $nin: friendsListId } }
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
  const requestFriends = res.locals.user.requestFriends;
  // $in : in
  const users = await User.find({
    _id: { $in: requestFriends },
    status: "active",
    deleted: false
  }).select("id avatar fullName");

  res.render("client/pages/users/request", {
    pageTitle: "Lời mời đã gửi",
    users: users
  });
};
// [GET] /users/accept
module.exports.accept = async (req, res) => {
  usersSocket(req, res);
  const acceptFriends = res.locals.user.acceptFriends;
  // $in : in
  const users = await User.find({
    _id: { $in: acceptFriends },
    status: "active",
    deleted: false
  }).select("id avatar fullName");

  res.render("client/pages/users/accept", {
    pageTitle: "Lời mời đã nhận",
    users: users
  });
};
// [GET] /users/friends
module.exports.friends = async (req, res) => {
  usersSocket(req, res);
  const friendsList = res.locals.user.friendsList;
  const friendsListId = friendsList.map(item => item.userId);

  // $in : in
  const users = await User.find({
    _id: { $in: friendsListId },
    status: "active",
    deleted: false
  }).select("id avatar fullName statusOnline");
  users.forEach(user =>{
    const infoUser = friendsList.find(friend =>friend.userId === user.id);
    user.roomChatId = infoUser.roomChatId; 
  })
  res.render("client/pages/users/friends", {
    pageTitle: "Danh sách bạn bè",
    users: users
  });
};