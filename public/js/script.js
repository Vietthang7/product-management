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

document.querySelector([online - payment]).addEventListener('click', async () => {
  const orderId = '12345'; // ID đơn hàng của bạn  
  const amount = 100000; // Số tiền thanh toán (đơn vị: VND)  

  try {
    const response = await fetch('https://api.sepay.vn/payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer B3D9640222C378B621D2472D5E35D037081F56DA83EFF9381299E09A86A7BB49`, // API Token của bạn  
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderId,
        amount: amount,
        // Thêm thông tin khác nếu cần  
      }),
    });

    const data = await response.json();
    if (data.success) {
      // Tạo mã QR từ URL thanh toán  
      $('#qrcode').empty(); // Xóa mã QR cũ nếu có  
      $('#qrcode').qrcode(data.paymentUrl); // Tạo mã QR mới  

      // Chuyển hướng đến trang thanh toán của SePay (nếu cần)  
      // window.location.href = data.paymentUrl; // Nếu bạn muốn chuyển hướng  
    } else {
      alert('Thanh toán không thành công: ' + data.message);
    }
  } catch (error) {
    console.error('Lỗi:', error);
    alert('Đã xảy ra lỗi trong quá trình thanh toán.');
  }
});