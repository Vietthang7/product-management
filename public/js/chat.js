var socket = io();  

//CLIENT_SEND_MESSAGE  
const formChat = document.querySelector(".chat .inner-form");  
if (formChat) {  
  formChat.addEventListener("submit", (event) => {  
    event.preventDefault();  
    
    const content = event.target.content.value;  
    if(content){  
      socket.emit("CLIENT_SEND_MESSAGE", {  
        content: content  
      });  
      event.target.content.value = "";  
      
      // Scroll the chat body to the bottom after sending the message  
      const bodyChat = document.querySelector(".chat .inner-body");  
      if (bodyChat) {  
        bodyChat.scrollTop = bodyChat.scrollHeight;  
      }  
    }  
  });  
}  

//SERVER_RETURN_MESSAGE  
socket.on("SERVER_RETURN_MESSAGE", (data) => {  
  const myId = document.querySelector("[my-id]").getAttribute("my-id");  
  const div = document.createElement("div");  
  let htmlFullName = "";  

  if(data.userId == myId) {  
    div.classList.add("inner-outgoing");  
  } else {  
    div.classList.add("inner-incoming");  
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;  
  }  

  div.innerHTML = `${htmlFullName}  
  <div class="inner-content">${data.content}</div>`;  

  const body = document.querySelector(".chat .inner-body");  
  body.appendChild(div);  

  // Chỉ cuộn trò chuyện xuống dưới cùng nếu người gửi là người dùng hiện tại 
  if (data.userId == myId) {  
    body.scrollTop = body.scrollHeight; // chỉ cuộn nếu đó là tin nhắn đã gửi  
  }  
});  

//  Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
//  End Scroll Chat To Bottom