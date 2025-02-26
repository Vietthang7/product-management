// Chức năng gửi yêu cầu kết bạn
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach(button => {
    button.addEventListener("click", () => {
      // Việc 1: Thêm class "add" cho box-user
      button.closest(".box-user").classList.add("add");
      // Việc 2: Gửi lên server userIdB
      const userIdB = button.getAttribute("btn-add-friend");
      socket.emit("CLIENT_ADD_FRIEND", userIdB);
    })
  })
}
// Hết Chức năng gửi yêu cầu kết bạn


//Chức năng hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach(button => {
    button.addEventListener("click", () => {
      // Việc 1: Xóa class "add" cho box-user
      button.closest(".box-user").classList.remove("add");
      // Việc 2: Gửi lên server userIdB
      const userIdB = button.getAttribute("btn-cancel-friend");
      socket.emit("CLIENT_CANCEL_FRIEND", userIdB);
    })
  })
}
// End Chức năng hủy gửi yêu cầu

// Chức năng chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach(button => {
    button.addEventListener("click", () => {
      // Việc 1: Thêm class "accepted" cho box-user
      button.closest(".box-user").classList.add("accepted");
      // Việc 2: Gửi lên server userIdB
      const userIdB = button.getAttribute("btn-accept-friend");
      socket.emit("CLIENT_ACCEPT_FRIEND", userIdB);
    })
  })
}
// End Chức năng chấp nhận kết bạn 

// Chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach(button => {
    button.addEventListener("click", () => {
      // Việc 1: Thêm class "refuse" cho box-user
      button.closest(".box-user").classList.add("refuse");
      // Việc 2: Gửi lên server userIdB
      const userIdB = button.getAttribute("btn-refuse-friend");
      socket.emit("CLIENT_REFUSE_FRIEND", userIdB);
    })
  })
}
//End Chức năng từ chối kết bạn
// Chức năng hủy kết bạn
const listBtnCancelFriended = document.querySelectorAll("[btn-cancel-friended]");
if (listBtnCancelFriended.length > 0) {
  listBtnCancelFriended.forEach(button => {
    button.addEventListener("click", () => {
      // Việc 1: Thêm class "cancel" cho box-user
      button.closest(".box-user").classList.add("cancel");
      // Việc 2: Gửi lên server userIdB
      const userIdB = button.getAttribute("btn-cancel-friended");
      socket.emit("CLIENT_CANCEL_FRIENDED", userIdB);
    })
  })
}
// End Chức năng hủy kết bạn

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  const badgeUsersAccept = document.querySelector(`[badge-users-accept="${data.userId}"]`);
  if (badgeUsersAccept) {
    badgeUsersAccept.innerHTML = data.length;
  }
})
// END SERVER_RETURN_LENGTH_ACCEPT_FRIEND

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  const dataUsersAccept = document.querySelector(`[data-users-accept="${data.userIdB}"]`);
  console.log(dataUsersAccept);
  if (dataUsersAccept) {
    const boxUserA = document.createElement("div");
    boxUserA.classList.add("col-6");
    boxUserA.setAttribute('user-id', data.infoA._id);
    boxUserA.innerHTML = `
      <div class="box-user">  
        <div class="inner-avatar">  
          <img src="${data.infoA.avatar ? data.infoA.avatar : '/images/users.jpg'}" alt="${data.infoA.fullName}">  
    </div>  
    <div class="inner-info">  
        <div class="inner-name">${data.infoA.fullName}</div>  
        <div class="inner-buttons">  
            <button class="btn btn-sm btn-primary mr-1" btn-accept-friend="${data.infoA._id}">Chấp nhận</button>  
            <button class="btn btn-sm btn-primary mr-1" btn-refuse-friend="${data.infoA._id}">Xóa</button>  
            <button class="btn btn-sm btn-primary mr-1" btn-deleted-friend disabled>Đã xóa</button>  
            <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend>Đã chấp nhận</button>  
        </div>  
    </div>  
</div>
    `;

    dataUsersAccept.appendChild(boxUserA);
    // Bắt sự kiện cho nút xóa
    const buttonRefuse = boxUserA.querySelector("[btn-refuse-friend]");
    buttonRefuse.addEventListener("click", () => {
      // Việc 1: Thêm class "refuse" cho box-user
      buttonRefuse.closest(".box-user").classList.add("refuse");
      // Việc 2: Gửi lên server userIdA
      const userIdA = buttonRefuse.getAttribute("btn-refuse-friend");
      socket.emit("CLIENT_REFUSE_FRIEND", userIdA);
    })
    //Bắt sự kiện cho nút chấp nhận
    const buttonAccept = boxUserA.querySelector("[btn-accept-friend]");
    buttonAccept.addEventListener("click", () => {
      // Việc 1 :Thêm class "accepted" cho box-user
      buttonAccept.closest(".box-user").classList.add("accepted");
      // Việc 2: Gửi lên server userIdA
      const userIdA = buttonAccept.getAttribute("btn-accept-friend");
      socket.emit("CLIENT_ACCEPT_FRIEND", userIdA);
    })
  }
})
// END SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_ID_CANCEL_FRIEND", (data) => {
  const dataUsersAccept = document.querySelector(`[data-users-accept="${data.userIdB}"]`);
  if (dataUsersAccept) {
    const boxUserA = dataUsersAccept.querySelector(`[user-id="${data.userIdA}"]`);
    if (boxUserA) {
      dataUsersAccept.removeChild(boxUserA);
    }
  }
})
// END SERVER_RETURN_ID_CANCEL_FRIEND

// SERVER_RETURN_ID_ACCEPT_FRIEND
socket.on("SERVER_RETURN_ID_ACCEPT_FRIEND", (data) => {
  const dataUsersNotAccept = document.querySelector(`[data-users-not-friend="${data.userIdB}"]`);
  if (dataUsersNotAccept) {
    const boxUserA = dataUsersNotAccept.querySelector(`[user-id="${data.userIdA}"]`);
    if (boxUserA) {
      dataUsersNotAccept.removeChild(boxUserA);
    }
  }
})
// END SERVER_RETURN_ID_ACCEPT_FRIEND

//SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_ONLINE", (data) => {
  const dataUsersFriend = document.querySelector("[data-users-friend]");
  if (dataUsersFriend) {
    const boxUserA = dataUsersFriend.querySelector(`[user-id="${data.userIdA}"]`);

    if (boxUserA){
      const boxStatus = boxUserA.querySelector("[status]");
      boxStatus.setAttribute("status",data.status); 
    }
  }
})
//END SERVER_RETURN_USER_ONLINE