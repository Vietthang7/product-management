const User = require("../../models/user.model");

module.exports = (req, res) =>{
  const userIdA = res.locals.user.id;
  _io.once("connection", (socket) => {
    // Khi A gửi yêu cầu cho B
    socket.on("CLIENT_ADD_FRIEND", async (userIdB) =>{
      // Thêm id của A  vào acceptFriend của B
      const exitUserAInB = await User.findOne({
        _id : userIdB,
        acceptFriend : userIdA
      });
      if(!exitUserAInB){
        await User.updateOne({
          _id : userIdB
        },
      {
        $push : {
          acceptFriend : userIdA
        }
      });
      }
      // Thêm id của B vào requestFriends của A
      const exitUserBInA = await User.findOne({
        _id : userIdA,
        requestFriend : userIdB
      });
      if(!exitUserBInA){
        await User.updateOne({
          _id : userIdA
        },{
          $push : {
            requestFriend:userIdB
          }
        });
      }
      })
      // End khi A gửi yêu cầu cho B

      // Chức năng hủy gửi yêu cầu
      socket.on("CLIENT_CANCEL_FRIEND", async (userIdB) =>{
        // Xóa id của A trong acceptFriend của B
        const exitUserAInB = await User.findOne({
          _id : userIdB,
          acceptFriend : userIdA
        });
        if(exitUserAInB){
          await User.updateOne({
            _id : userIdB
          },
        {
          $pull : {
            acceptFriend : userIdA
          }
        });
        }
        // Xóa id của B trong requestFriends của A
        const exitUserBInA = await User.findOne({
          _id : userIdA,
          requestFriend : userIdB
        });
        if(exitUserBInA){
          await User.updateOne({
            _id : userIdA
          },{
            $pull : {
              requestFriend:userIdB
            }
          });
        }
        })
      // End Chức năng hủy gửi yêu cầu
    })

  }