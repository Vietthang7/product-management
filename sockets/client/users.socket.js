const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");
module.exports = (req, res) => {
  const userIdA = res.locals.user.id;
  _io.once("connection", (socket) => {
    // Khi A gửi yêu cầu cho B
    socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
      // Thêm id của A  vào acceptFriend của B
      const exitUserAInB = await User.findOne({
        _id: userIdB,
        acceptFriends: userIdA
      });
      if (!exitUserAInB) {
        await User.updateOne({
          _id: userIdB
        },
          {
            $push: {
              acceptFriends: userIdA
            }
          });
      }
      // Thêm id của B vào requestFriends của A
      const exitUserBInA = await User.findOne({
        _id: userIdA,
        requestFriends: userIdB
      });
      if (!exitUserBInA) {
        await User.updateOne({
          _id: userIdA
        }, {
          $push: {
            requestFriends: userIdB
          }
        });
      }
      //Trả cho B độ dài của acceptFriends
      const infoB = await User.findOne({
        _id: userIdB
      });
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        length: infoB.acceptFriends.length,
        userId: userIdB
      });
      //Lấy thông tin của A gửi về cho B
      const infoA = await User.findOne({
        _id: userIdA,
      }).select("id fullName avatar");
      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userIdB: userIdB,
        infoA: infoA
      });
      //Lấy id của A gửi cho B
      socket.broadcast.emit("SERVER_RETURN_ID_ACCEPT_FRIEND", {
        userIdA: userIdA,
        userIdB: userIdB
      })
    })
    // End khi A gửi yêu cầu cho B

    // Chức năng hủy gửi yêu cầu
    socket.on("CLIENT_CANCEL_FRIEND", async (userIdB) => {
      // Xóa id của A trong acceptFriend của B
      const exitUserAInB = await User.findOne({
        _id: userIdB,
        acceptFriends: userIdA
      });
      if (exitUserAInB) {
        await User.updateOne({
          _id: userIdB
        },
          {
            $pull: {
              acceptFriends: userIdA
            }
          });
      }
      // Xóa id của B trong requestFriends của A
      const exitUserBInA = await User.findOne({
        _id: userIdA,
        requestFriends: userIdB
      });
      if (exitUserBInA) {
        await User.updateOne({
          _id: userIdA
        }, {
          $pull: {
            requestFriends: userIdB
          }
        });
      }
      // Trả về cho B dộ dài của acceptFriends
      const infoB = await User.findOne({
        _id: userIdB
      });
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        length: infoB.acceptFriends.length,
        userId: userIdB
      });

      // Trả về cho B id của A
      socket.broadcast.emit("SERVER_RETURN_ID_CANCEL_FRIEND", {
        userIdA: userIdA,
        userIdB: userIdB
      });
    })
    // End Chức năng hủy gửi yêu cầu

    // Chức năng chấp nhận kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userIdB) => {
      try {
        // Tạo phòng chat chung
        const roomChat = new RoomChat({
          typeRoom: "friend",
          users: [
            {
              userId: userIdA,
              role: "superAdmin"
            },
            {
              userId: userIdB,
              role: "superAdmin"
            }
          ]
        });
        await roomChat.save();
      // Thêm {userId, roomChatId} của B vào friendsList của A
      // Xóa id của B trong acceptFriends của A
      const existUserBInA = await User.findOne({
        _id: userIdA,
        acceptFriends: userIdB
      });

      if (existUserBInA) {
        await User.updateOne({
          _id: userIdA
        }, {
          $push: {
            friendsList: {
              userId: userIdB,
              roomChatId: roomChat.id
            }
          },
          $pull: {
            acceptFriends: userIdB
          }
        });
      }

      // Thêm {userId, roomChatId} của A vào friendsList của B
      // Xóa id của A trong requestFriends của B
      const existUserAInB = await User.findOne({
        _id: userIdB,
        requestFriends: userIdA
      });

      if (existUserAInB) {
        await User.updateOne({
          _id: userIdB
        }, {
          $push: {
            friendsList: {
              userId: userIdA,
              roomChatId: roomChat.id
            }
          },
          $pull: {
            requestFriends: userIdA
          }
        });
      }
    } catch(error){
      console.log(error);
    }
    })
    // End Chức năng chấp nhận kết bạn

    // Chức năng từ chối kết bạn
    socket.on("CLIENT_REFUSE_FRIEND", async (userIdB) => {
      // Xóa id của B trong acceptFriend của A
      const exitUserBInA = await User.findOne({
        _id: userIdA,
        acceptFriends: userIdB
      });
      if (exitUserBInA) {
        await User.updateOne({
          _id: userIdA
        },
          {
            $pull: {
              acceptFriends: userIdB
            }
          });
      }
      // Xóa id của A trong requestFriends của B
      const exitUserAInB = await User.findOne({
        _id: userIdB,
        requestFriends: userIdA
      });
      if (exitUserAInB) {
        await User.updateOne({
          _id: userIdB
        }, {
          $pull: {
            requestFriends: userIdA
          }
        });
      }
    })
    // End Chức năng từ chối kết bạn

    // Chức năng hủy kết bạn
    socket.on("CLIENT_CANCEL_FRIENDED", async (userIdB) => {
      // Xóa {userId, roomChatId} của B trong friendsList của A
      const existUserBInA = await User.findOne({
        _id: userIdA,
        'friendsList': {
          $elemMatch: { userId: userIdB }
        }
      });

      if (existUserBInA) {
        await User.updateOne({
          _id: userIdA
        }, {
          $pull: {
            friendsList: {
              userId: userIdB,
              roomChatId: ""
            }
          }
        });
      }

      // Xóa {userId, roomChatId} của A trong friendsList của B
      const existUserAInB = await User.findOne({
        _id: userIdB,
        'friendsList': {
          $elemMatch: { userId: userIdA }
        }
      });

      if (existUserAInB) {
        await User.updateOne({
          _id: userIdB
        }, {
          $pull: {
            friendsList: {
              userId: userIdA,
              roomChatId: ""
            }
          }
        });
      }

    })
    // End Chức năng hủy kết bạn
  });
}
