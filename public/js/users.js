// Chức năng gửi yêu cầu kết bạn
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach(button => {
    button.addEventListener("click", () => {
      // Việc 1: Thêm class "add" cho box-user
      button.closest(".box-user").classList.add("add");
      // Việc 2: Gửi lên server userIdB
      const userIdB = button.getAttribute("btn-add-friend");
      socket.emit("CLIENT_ADD_FRIEND",userIdB);
    })
  })
}
// Hết Chức năng gửi yêu cầu kết bạn


//Chức năng hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach(button => {
    button.addEventListener("click", () => {
      // Việc 1: Thêm class "add" cho box-user
      button.closest(".box-user").classList.remove("add");
      // Việc 2: Gửi lên server userIdB
      const userIdB = button.getAttribute("btn-cancel-friend");
      socket.emit("CLIENT_CANCEL_FRIEND",userIdB);
    })
  })
}
// End Chức năng hủy gửi yêu cầu