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
        } else {}
    });
}
//  End Box Actions

// Xóa bản ghi
const listButtonDelete = document.querySelectorAll("[button-delete]");
if (listButtonDelete.length > 0) {
    listButtonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-delete");
            
            fetch(`/admin/products/delete/${id}`, {
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

//End xóa bản ghi