const paginationHelper = require("../../helpers/pagination.helper");
const User = require("../../models/user.model");
const moment = require("moment");
const md5 = require('md5');
const generateHelper = require("../../helpers/generate.helper");
const systemConfig = require("../../config/system");
const Account = require("../../models/accounts.model");
// [GET] /admin/users/
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  }
  const filterStatus = [{
    label: "Tất cả",
    value: ""
  },
  {
    label: "Đang hoạt động",
    value: "active"
  },
  {
    label: "Dừng hoạt động",
    value: "inactive"
  },
  ];
  if (req.query.status) {
    find.status = req.query.status;
  }
  // Tìm kiếm 
  let keyword = "";
  if (req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i");
    find.fullName = regex;
    keyword = req.query.keyword;
  }
  // Hết tìm kiếm

  // Phân trang
  const pagination = await paginationHelper.paginationUser(req, find);

  // Hết phân trang
  //Sắp xếp
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.createdAt = "desc";
  }
  // Hết sắp xếp
  const users = await User
    .find(find)
    .limit(pagination.limitItems) // số lượng tối thiểu 
    .skip(pagination.skip) // bỏ qua
    .sort(sort);

  for (const item of users) {
    if (item.createdBy) {
      const accountCreated = await Account.findOne({
        _id: item.createdBy
      });
      item.createdByFullName = accountCreated.fullName;
    } else {
      item.createdByFullName = "";
    }
    item.createdAtFormat = moment(item.createdAt).format("DD/MM/YY HH:mm:ss");
    // Người cập nhật
    if (item.updatedBy) {
      const accountUpdated = await Account.findOne({
        _id: item.updatedBy
      });
      item.updatedByFullName = accountUpdated.fullName;
    } else {
      item.updatedByFullName = "";
    }

    item.updatedAtFormat = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
  }
  res.render("admin/pages/users/index", {
    pageTitle: "Trang danh sách tài khoản user",
    users: users,
    keyword: keyword,
    filterStatus: filterStatus,
    pagination: pagination
  });
}
// [GET] /admin/users/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/users/create", {
    pageTitle: "Tài khoản users",
  }
  );
}
// [POST] /admin/users/create
module.exports.createPost = async (req, res) => {
  if (res.locals.role.permissions.includes("users_create")) {
    const existUserTrash = await User.findOne({
      email: req.body.email,
      deleted: true
    })
    if(existUserTrash){
      req.flash("error", "Tài khoản đã tồn tại và nằm trong thùng rác");
      res.redirect("back");
      return;
    }
    const existUser = await User.findOne({
      email: req.body.email,
      deleted: false
    })
    if(existUser){
    req.flash("error", "Email đã tồn tại");
    res.redirect("back");
    return;
    }
    req.body.password = md5(req.body.password);
    req.body.token = generateHelper.generateRandomString(30);
    req.body.createdBy = res.locals.account.id;
    const user = new User(req.body);
    await user.save();
    req.flash("success", "Tạo mới tài khoản thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/users`);
  } else {
    res.send("403");
  }
}
// [GET] /admin/users/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({
      _id: id,
      deleted: false
    });
    if (user) {
      res.render("admin/pages/users/edit", {
        pageTitle: "Tài khoản client",
        user: user
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/users`);
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/users`);
  }
}
// [PATCH] /admin/users/edit/:id
module.exports.editPatch = async (req, res) => {
  if (res.locals.role.permissions.includes("users_edit")) {
    try {
      const id = req.params.id;

      if (req.body.password == "") {
        delete req.body.password;
      } else {
        req.body.password = md5(req.body.password);
      }
      req.body.updatedBy = res.locals.account.id;
      await User.updateOne({
        _id: id,
        deleted: false
      }, req.body);
      req.flash("success", "Cập nhật thành công!");
    } catch (error) {
      req.flash("error", "Id tài khoản  không hợp lệ!");
    }
    res.redirect("back");
  } else {
    res.send("403");
  }
}
// [GET] /admin/users/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({
      _id: id,
      deleted: false
    });
    if (user) {
      res.render("admin/pages/users/detail", {
        pageTitle: "Chi tiết sản phẩm",
        user: user
      });
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/users`);
    }
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/users`);
  }
}
// [GET] /admin/users/trash
module.exports.trash = async (req, res) => {
  const find = {
    deleted: true
  }
  const filterStatus = [{
    label: "Tất cả",
    value: ""
  }, {
    label: "Đang hoạt động",
    value: "active"
  }, {
    label: "Dừng hoạt động",
    value: "inactive"
  },
  ];
  if (req.query.status) {
    find.status = req.query.status;
  }
  // Tìm kiếm 
  let keyword = "";
  if (req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i");
    find.fullName = regex;
    keyword = req.query.keyword;
  }
  // Hết tìm kiếm

  // Phân trang
  const pagination = await paginationHelper.paginationUser(req, find);
  // Hết phân trang
  //Sắp xếp
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.updatedAt = "desc";
  }
  // Hết sắp xếp
  const users = await User
    .find(find)
    .limit(pagination.limitItems) // số lượng tối thiểu 
    .skip(pagination.skip) // bỏ qua
    .sort(sort);
  // res.send("ok");
  // console.log(users);
  for (const item of users) {
    if (item.createdBy) {
      const accountCreated = await Account.findOne({
        _id: item.createdBy
      });
      item.createdByFullName = accountCreated.fullName;
    } else {
      item.createdByFullName = "";
    }
    item.createdAtFormat = moment(item.createdAt).format("DD/MM/YY HH:mm:ss");
    if (item.updatedBy) {
      const accountUpdated = await Account.findOne({
        _id: item.updatedBy
      });
      item.updatedByFullName = accountUpdated.fullName;
    } else {
      item.updatedByFullName = "";
    }

    item.updatedAtFormat = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
    if (item.deletedBy) {
      const accountDeleted = await Account.findOne({
        _id: item.deletedBy
      });
      item.deletedByFullName = accountDeleted.fullName;
    } else {
      item.deletedByFullName = "";
    }

    item.updatedAtFormat = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
  }
  res.render("admin/pages/users/trash", {
    pageTitle: "Trang thùng rác",
    users: users,
    keyword: keyword,
    filterStatus: filterStatus,
    pagination: pagination
  });
}
//[PATCH]/admin/users/delete/:id
module.exports.deleteItem = async (req, res) => {
  if (res.locals.role.permissions.includes("users_delete")) {
    try {
      const id = req.params.id;
      await User.updateOne({
        _id: id
      }, {

        deleted: true,
        deletedBy: res.locals.account.id
      });
      req.flash('success', 'Đã chuyển vào thùng rác!');
      res.json({
        code: 200
      })
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/users`);
    }
  } else {
    res.send(`403`);
  }
}
// [PATCH] /admin/users/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
  if (res.locals.role.permissions.includes("users_edit")) {
    try {
      const {
        id,
        statusChange
      } = req.params;
      await User.updateOne({
        _id: id

      }, {
        status: statusChange
      });
      req.flash('success', 'Cập nhật trạng thái thành công!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/users`);
    }
  }
  else {
    res.send(`403`);
  }
}
// [PATCH] /admin/users/change-multi
module.exports.changeMulti = async (req, res) => {
  if (res.locals.role.permissions.includes("users_edit")) {
    try {
      const {
        status,
        ids
      } = req.body;
      console.log(req.body);
      switch (status) {
        case "active":
        case "inactive":
          await User.updateMany({
            _id: ids
          }, {
            status: status
          });
          req.flash('success', 'Cập nhật trạng thái thành công!');
          break;
        case "delete":
          await User.updateMany({
            _id: ids
          }, {
            deleted: true
          });
          req.flash('success', 'Đã chuyển vào thùng rác!');
        default:
          break;
      }
      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/users`);
    }
  } else {
    res.send(`403`);
  }
}
// [PATCH] /admin/users/trash/restore/:id
module.exports.restore = async (req, res) => {
  if (res.locals.role.permissions.includes("users_edit")) {
    try {
      const id = req.params.id;
      await User.updateOne({
        _id: id

      }, {
        deleted: false,
        updatedBy: res.locals.account.id
      });
      req.flash('success', 'Khôi phục thành công!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/users/trash`);
    }
  }
  else {
    res.send(`403`);
  }
}
// [PATCH] /admin/users/trash/change-multi
module.exports.changeMultiRestore = async (req, res) => {
  if (res.locals.role.permissions.includes("users_edit")) {
    try {
      const {
        acts,
        ids
      } = req.body;
      switch (acts) {
        case "restore":
          await User.updateMany({
            _id: ids
          }, {
            deleted: false
          });
          break;
        case "delete-permanently":
          await User.deleteMany({
            _id: ids
          });
          break;
        default:
          break;
      }
      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/users/trash`);
    }
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/users/trash/detail/:id
module.exports.detailTrash = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({
      _id: id,
      deleted: true
    });
    if (user) {
      res.render("admin/pages/users/detail", {
        pageTitle: "Chi tiết sản phẩm",
        user: user
      });
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/users/trash`);
    }
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/users/trash`);
  }
}
// [DELETE] /admin/users/trash/deletePermanently/:id
module.exports.deletePermanently = async (req, res) => {
  if (res.locals.role.permissions.includes("users_delete")) {
    try {
      const id = req.params.id;
      await User.deleteOne({
        _id: id

      }, {
        deleted: true
      });
      req.flash('success', 'Xóa thành công!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/users/trash`);
    }
  }
  else {
    res.send(`403`);
  }
}