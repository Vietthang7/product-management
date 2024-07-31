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
// Đổi mật khẩu
const buttonResetPassword = document.querySelector("[reset-password]");
buttonResetPassword.addEventListener("click", () => {
  const link = buttonResetPassword.getAttribute("link");
  console.log(link);
  fetch(link, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.code == 200) {
        window.location.reload();
      }
    })

});
// End Đổi mật khẩu