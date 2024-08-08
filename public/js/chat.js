import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';
var socket = io();

//CLIENT_SEND_MESSAGE  
const formChat = document.querySelector(".chat .inner-form");
if (formChat) {
  formChat.addEventListener("submit", (event) => {
    event.preventDefault();

    const content = event.target.content.value;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content
      });
      event.target.content.value = "";

      // Cuộn nội dung trò chuyện xuống phía dưới sau khi gửi tin nhắn  
      const bodyChat = document.querySelector(".chat .inner-body");
      if (bodyChat) {
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    }
    const tooltip = document.querySelector('.tooltip');
    if (tooltip.classList.contains('shown')) {
      tooltip.classList.remove('shown');
    }
  });
}

//SERVER_RETURN_MESSAGE  
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const div = document.createElement("div");
  let htmlFullName = "";
  const body = document.querySelector(".chat .inner-body");
  let checkScroll = false;
  if (data.userId == myId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    const isScrollAtBottom = (element) => element.scrollHeight - element.clientHeight <= element.scrollTop + 1;
    if (isScrollAtBottom(body)) {
      checkScroll = true;
    }
  }

  div.innerHTML = `${htmlFullName}  
  <div class="inner-content">${data.content}</div>`;

  // const body = document.querySelector(".chat .inner-body");
  body.appendChild(div);

  // Chỉ cuộn trò chuyện xuống dưới cùng nếu người gửi là người dùng hiện tại   
  if (data.userId == myId) {
    body.scrollTop = body.scrollHeight; // chỉ cuộn nếu đó là tin nhắn đã gửi hoặc đang ở cuối  
  } else {
    if (checkScroll) {
      body.scrollTop = body.scrollHeight; // cuộn xuống nếu thanh scroll của người nhận ở vị trí cuối cùng
    }
  }

});

//  Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
//  End Scroll Chat To Bottom

// Show Icon Chat
const emojiPicker = document.querySelector('emoji-picker');
if (emojiPicker) {
  const inputChat = document.querySelector(".chat .inner-form input[name='content']");

  emojiPicker.addEventListener('emoji-click', (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;
  });
}
// End Show Icon Chat


// Show Popup Icon
const buttonIcon = document.querySelector("[button-icon]");
if (buttonIcon) {
  const tooltip = document.querySelector('.tooltip');
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle('shown');
  });
}
// End Show Popup Icon


// Ẩn tooltip khi nhấn chuột ra ngoài  
document.addEventListener("click", (event) => {
  const buttonIcon = document.querySelector("[button-icon]");
  const tooltip = document.querySelector('.tooltip');
  if (!buttonIcon.contains(event.target) && !tooltip.contains(event.target) && tooltip.classList.contains('shown')) {
    tooltip.classList.remove('shown');
  }
});