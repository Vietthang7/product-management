var socket = io();
// Cập nhật số lượng sản phẩm trong giỏ hàng
const listInputQuantity = document.querySelectorAll("[cart] input[name='quantity']");
if (listInputQuantity.length > 0) {
  listInputQuantity.forEach(input => {
    input.addEventListener("change", () => {
      const productId = input.getAttribute("product-id");
      const quantity = parseInt(input.value);

      if (productId && quantity > 0) {
        window.location.href = `/cart/update/${productId}/${quantity}`;
      }
    })
  })
}
// Hết Cập nhật số lượng sản phẩm trong giỏ hàng

// Check Item
const inputcheckAll = document.querySelector("input[name='checkAll']");
if (inputcheckAll) {
  const listInputCheckItem = document.querySelectorAll("input[name='checkItem']");
  // Bắt sự kiện cho nút checkAll
  inputcheckAll.addEventListener("click", () => {
    listInputCheckItem.forEach(inputCheckItem => {
      inputCheckItem.checked = inputcheckAll.checked;

    });
  });
  // Bắt sự kiện vào nút checkItem
  listInputCheckItem.forEach(inputCheckItem => {
    inputCheckItem.addEventListener("click", () => {
      const listInputCheckItemChecked = document.querySelectorAll("input[name='checkItem']:checked");
      if (listInputCheckItemChecked.length == listInputCheckItem.length) {
        inputcheckAll.checked = true;
      } else {
        inputcheckAll.checked = false;
      }
    });
  });
}
// End Check Item

// Lấy các phần tử liên quan đến việc hiện/ẩn mật khẩu  
const togglePasswordVisibility = document.querySelector("[togglePassword]"); // Nut hoặc biểu tượng để hiện/ẩn mật khẩu 
const togglePasswordVisibilityConfirm = document.querySelector("[togglePasswordConfirm]"); // Nut hoặc biểu tượng để hiện/ẩn mật khẩu 
const passwordInput = document.querySelector("input[name='password']"); // Input cho mật khẩu 
const confirmPasswordInput = document.querySelector("input[name='confirmpassword']");

if (togglePasswordVisibility && passwordInput) {
  togglePasswordVisibility.addEventListener("click", () => {
    let newType = "";
    const type = passwordInput.getAttribute("type");
    if (type === "password") {
      newType = "text";
    } else {
      newType = "password";
    }
    passwordInput.setAttribute("type", newType);

    // Thay đổi biểu tượng nếu cần (giả sử bạn có hai biểu tượng khác nhau cho hiện và ẩn)  
    if (newType === "password") {
      togglePasswordVisibility.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`
    } else {
      togglePasswordVisibility.innerHTML = `<i class="fa-solid fa-eye"></i>`
    }
  });
}
if (togglePasswordVisibilityConfirm && confirmPasswordInput) {
  togglePasswordVisibilityConfirm.addEventListener("click", () => {
    let newType = "";
    const type = confirmPasswordInput.getAttribute("type");
    if (type === "password") {
      newType = "text";
    } else {
      newType = "password";
    }
    confirmPasswordInput.setAttribute("type", newType);

    if (newType === "password") {
      togglePasswordVisibilityConfirm.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`
    } else {
      togglePasswordVisibilityConfirm.innerHTML = `<i class="fa-solid fa-eye"></i>`
    }
  });
}
//  End Lấy các phần tử liên quan đến việc hiện/ẩn mật khẩu


//Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", () => {
    const file = uploadImageInput.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  })
}
// End Upload Image
// show-alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  let time = showAlert.getAttribute("show-alert") || 3000;
  time = parseInt(time);
  setTimeout(() => {
    showAlert.classList.add("hidden");
  }, time);
}
// End show-alert