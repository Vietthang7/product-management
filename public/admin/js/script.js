// Button Status
const listButtonStatus = document.querySelectorAll("[button-status]");
if (listButtonStatus.length > 0) {
  let url = new URL(window.location.href);

  // Bắt sự kiện click
  listButtonStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }

      window.location.href = url.href;
    });



  });
  // Thêm class active mặc định
  const statusCurrent = url.searchParams.get("status") || "";
  const buttonCurrent = document.querySelector(`[button-status="${statusCurrent}"]`);
  if (buttonCurrent) {
    buttonCurrent.classList.add("active");
  }

}
// End Button Status


// Form Search 
const formSearch = document.querySelector("[form-search]");
if (formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    const keyword = event.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;

  });
}
//End Form Search

//Pagination
const listButtonPagination = document.querySelectorAll("[button-pagination]");
if (listButtonPagination.length > 0) {
  let url = new URL(window.location.href);
  listButtonPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      url.searchParams.set("page", page);

      window.location.href = url.href;
    });
  });
}
// End Pagination

//Change Status
const listButtonChangeStatus = document.querySelectorAll("[button-change-status]");
if (listButtonChangeStatus.length >= 1) {
  listButtonChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const link = button.getAttribute("link");

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

  });
}
// End Change Status

//Restore
const listButtonChangeRestore = document.querySelectorAll("[button-restore]");
if (listButtonChangeRestore.length >= 1) {
  listButtonChangeRestore.forEach(button => {
    button.addEventListener("click", () => {
      const link = button.getAttribute("link");

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

  });
}
//Restore
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

// Box Actions
const boxActions = document.querySelector("[box-actions]");
if (boxActions) {
  const button = boxActions.querySelector("button");
  button.addEventListener("click", () => {
    const select = boxActions.querySelector("select");
    const status = select.value;


    const listInputChecked = document.querySelectorAll("input[name='checkItem']:checked");
    const ids = [];
    listInputChecked.forEach(input => {
      ids.push(input.value);
    });
    if (status && ids.length > 0) {
      const dataChangeMulti = {
        status: status,
        ids: ids
      };
      console.log(dataChangeMulti);
      const link = boxActions.getAttribute("box-actions");
      fetch(link, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataChangeMulti),
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == 200) {
            window.location.reload();
          }
        })
    } else {
      alert("Hành động và checkItem phải được chọn!");
    }
  });
}
//  End Box Actions

// Xóa bản ghi mềm
const listButtonDelete = document.querySelectorAll("[button-delete]");
if (listButtonDelete.length > 0) {
  listButtonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const link = button.getAttribute("button-delete");
      console.log(link);

      fetch(link, {
        method: "PATCH"
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == 200) {
            window.location.reload();
          }
        })
    });
  });
}
//End xóa bản ghi mềm 

//  Thay đổi vị trí
const listInputPosition = document.querySelectorAll("input[name='position']");
if (listInputPosition.length > 0) {
  listInputPosition.forEach(input => {
    input.addEventListener("change", () => {
      const link = input.getAttribute("link");
      const position = parseInt(input.value);
      fetch(link, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          position: position
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == 200) {
            window.location.reload();
          }
        })
    });
  })
}
// Hết thay đổi vị trí

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


// Sort 
const sort = document.querySelector("[sort]");
if (sort) {
  let url = new URL(window.location.href);
  const select = sort.querySelector("[sort-select]");
  select.addEventListener("change", () => {
    const [sortKey, sortValue] = select.value.split("-");
    if (sortKey && sortValue) {
      url.searchParams.set("sortKey", sortKey);
      url.searchParams.set("sortValue", sortValue);
      window.location.href = url.href;
    }
  })
  // Thêm selected mặc định cho option
  const defaultSortKey = url.searchParams.get("sortKey");
  const defaultSortValue = url.searchParams.get("sortValue");
  if (defaultSortKey && defaultSortValue) {
    const optionSelected = select.querySelector(`option[value ="${defaultSortKey}-${defaultSortValue}"]`);
    optionSelected.selected = true;
    // optionSelected.setAttribute("selected", true);
  }
  //Tính năng clear
  const buttonClear = sort.querySelector("[sort-clear]");
  if (buttonClear) {
    buttonClear.addEventListener("click", () => {
      url.searchParams.delete("sortKey");
      url.searchParams.delete("sortValue");
      window.location.href = url.href;
    })
  }
}
//End Sort

//Phân quyền
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", () => {
    const roles = [];

    const listElementRoleId = tablePermissions.querySelectorAll("[role-id]");
    for (const element of listElementRoleId) {
      const roleId = element.getAttribute("role-id");
      const role = {
        id: roleId,
        permissions: []
      };

      const listInputChecked = tablePermissions.querySelectorAll(`input[data-id="${roleId}"]:checked`);

      listInputChecked.forEach(input => {
        const dataName = input.getAttribute("data-name");
        role.permissions.push(dataName);
      });

      roles.push(role);
    }

    const path = buttonSubmit.getAttribute("button-submit");

    fetch(path, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roles)
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: data.message,
            showConfirmButton: false,
            timer: 1500
          });
        }
      })
  });
}
//Hết Phân quyền 

// Xóa bản ghi vĩnh viễn
const listButtonDeletePermanently = document.querySelectorAll("[button-delete-permanently]");
if (listButtonDeletePermanently.length > 0) {
  listButtonDeletePermanently.forEach(button => {
    button.addEventListener("click", () => {
      const link = button.getAttribute("link");
      fetch(link, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == 200) {
            window.location.reload();
          }
        })
    });
  });
}
// Hết Xóa bản ghi vĩnh viễn 


// Box ActionsTrash
const boxActionsTrash = document.querySelector("[box-actions-trash]");
if (boxActionsTrash) {
  const button = boxActionsTrash.querySelector("button");
  button.addEventListener("click", () => {
    const select = boxActionsTrash.querySelector("select");
    const acts = select.value;


    const listInputCheckedRestore = document.querySelectorAll("input[name='checkItem']:checked");
    const ids = [];
    listInputCheckedRestore.forEach(input => {
      ids.push(input.value);
    });
    if (acts && ids.length > 0) {
      const dataChangeMulti = {
        acts: acts,
        ids: ids
      };
      const link = boxActionsTrash.getAttribute("box-actions-trash");
      fetch(link, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataChangeMulti),
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == 200) {
            window.location.reload();
          }
        })
    } else { }
  });
}
//  End Box ActionsTrash
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

// Cập nhật số lượng sản phẩm trong đơn hàng admin(chỉ hiện demo bên FE) 
const totalPriceElement = document.querySelector('.total-price'); // Đối tượng để hiển thị tổng tiền 
const updateOrderTotalPrice = () => {
  let grandTotal = 0;
  const rows = document.querySelectorAll("tbody tr");
  rows.forEach(row => {
    const rowTotal = parseFloat(row.children[5].innerText) || 0; // Nếu không có giá trị thì mặc định là 0  
    grandTotal += rowTotal;
  });
  totalPriceElement.innerText = `Tổng đơn hàng: ${grandTotal.toFixed(2)}$`; // Cập nhật hiển thị tổng đơn hàng  
};

const listInputQuantity = document.querySelectorAll("[order] input[name='quantity']");
if (listInputQuantity.length > 0) {
  listInputQuantity.forEach(input => {
    // Lắng nghe sự thay đổi trong input để cập nhật tổng tiền hiển thị  
    input.addEventListener("change", () => {
      const unitPrice = parseFloat(input.closest('tr').children[3].innerText) || 0;
      const quantity = parseInt(input.value) || 0; // Nếu không có giá trị thì mặc định là 0  
      const totalPrice = (unitPrice * quantity).toFixed(2); // Tính tổng tiền cho sản phẩm  
      input.closest('tr').children[5].innerText = `${totalPrice}$`; // Cập nhật tổng tiền cho hàng này  

      // Cập nhật tổng tiền cho cả đơn hàng  
      updateOrderTotalPrice();
    });
  });
}
// Hết Cập nhật số lượng sản phẩm trong đơn hàng admin(chỉ hiện demo bên FE)


// Bắt sự kiện xuất file Excel
const exportExcel = document.querySelector("[exportExcel]");
exportExcel.addEventListener("click", () => {
  // Hàm hiển thị thông báo  
  const showNotification = (message) => {
    const notificationElement = document.getElementById("notification");
    notificationElement.textContent = message;
    notificationElement.style.display = "block"; // Hiển thị thông báo  
  };
  const hideNotification = () => {
    const notificationElement = document.getElementById("notification");
    notificationElement.style.display = "none"; // Ẩn thông báo  
  }
  const selectedOrders = [];
  const checkboxes = document.querySelectorAll('input[name="checkItem"]:checked');
  // Biến kiểm tra xem có đơn hàng inactive nào không  
  let hasInactiveOrders = false;
  checkboxes.forEach((checkbox) => {
    const statusInput = checkbox.nextElementSibling; // ô trạng thái ngay sau ô checkbox

    // Kiểm tra xem checkbox có được chọn có là trạng thái active
    if (statusInput.value === "active") {
      selectedOrders.push(checkbox.value);
    }
    else {
      hasInactiveOrders = true; // Đánh dấu nếu có trạng thái inactive 
    }
  });
  // Kiểm tra tình trạng các đơn hàng  
  if (hasInactiveOrders) {
    // Nếu có đơn hàng chưa được xác nhận, hiển thị thông báo  
    showNotification("Bạn đã chọn các đơn hàng chưa được xác nhận. Vui lòng chỉ chọn các đơn hàng đã xác nhận");
  } else if (selectedOrders.length > 0) {
    // Xuất file nếu có đơn hàng hợp lệ  
    const link = exportExcel.getAttribute("link");
    fetch(link, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedOrders),
    })
      .then(response => {
        if (response.ok) {
          return response.blob(); // Nhận file blob  
        }
        throw new Error('Có lỗi xảy ra khi xuất file!');
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'orders.xlsx'; // Tên file xuất  
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.location.reload();
      })
      .catch(error => {
        alert(error.message);
      });
    hideNotification();
  } else {
    // Nếu không có đơn hàng nào hợp lệ  
    showNotification("Không có đơn hàng nào được xác nhận để xuất file.");
  }
})
  // End Bắt sự kiện xuất file Excel
  