const Role = require("../../models/role.model");
const md5 = require('md5');
const systemConfig = require("../../config/system");
const Account = require("../../models/accounts.model");
const generateHelper = require("../../helpers/generate.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const moment = require("moment");
// [GET] /admin/accounts
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

    //Sắp xếp
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort.createdAt = "desc";
    }
    // Hết sắp xếp
  //Phân trang
  const pagination = await paginationHelper.paginationAccount(req, find);
  //Hết  Phân trang

  const records = await Account
    .find(find)
    .limit(pagination.limitItems) // số lượng tối thiểu 
    .skip(pagination.skip) // bỏ qua
    .sort(sort);
  for (const item of records) {
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
  } for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false
    });
    record.roleTitle = role.title;
  }
  res.render("admin/pages/accounts/index", {
    pageTitle: "Tài khoản admin",
    records: records,
    keyword: keyword,
    filterStatus: filterStatus,
    pagination: pagination
  }
  );
}
// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  }).select("title");
  res.render("admin/pages/accounts/create", {
    pageTitle: "Tài khoản admin",
    roles: roles
  }
  );
}
// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  if (res.locals.role.permissions.includes("accounts_create")) {
    const existAccountTrash = await Account.findOne({
      email: req.body.email,
      deleted: true
    })
    if(existAccountTrash){
      req.flash("error", "Tài khoản đã tồn tại và nằm trong thùng rác");
      res.redirect("back");
      return;
    }
    const existAccount = await Account.findOne({
      email: req.body.email,
      deleted: false
    })
    if (existAccount) {
      req.flash("error", "Email đã tồn tại");
      res.redirect("back");
      return;
    }
    req.body.password = md5(req.body.password);
    req.body.token = generateHelper.generateRandomString(30);
    req.body.createdBy = res.locals.account.id;
    const account = new Account(req.body);
    await account.save();
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  } else {
    res.send("403");
  }
}
// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const account = await Account.findOne({
      _id: id,
      deleted: false
    });
    if (account) {
      const roles = await Role.find({
        deleted: false
      }).select("title");

      res.render("admin/pages/accounts/edit", {
        pageTitle: "Tài khoản admin",
        roles: roles,
        account: account
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  if (res.locals.role.permissions.includes("accounts_edit")) {
    try {
      const id = req.params.id;

      if (req.body.password == "") {
        delete req.body.password;
      } else {
        req.body.password = md5(req.body.password);
      }
      req.body.updatedBy = res.locals.account.id;
      await Account.updateOne({
        _id: id,
        deleted: false
      }, req.body);
      req.flash("success", "Cập nhật thành công!");
    } catch (error) {
      req.flash("error", "Id tài khoản không hợp lệ!");
    }
    res.redirect("back");
  } else {
    res.send("403");
  }
}
// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const account = await Account.findOne({
      _id: id,
      deleted: false
    });
    if (account) {
      const roles = await Role.findOne({
        _id: account.role_id,
        deleted: false
      });
      res.render("admin/pages/accounts/detail", {
        pageTitle: "Chi tiết tài khoản",
        roles: roles,
        account: account
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
}
// [PATCH] /admin/accounts/delete/:id
module.exports.deleteItem = async (req, res) => {
  if (res.locals.role.permissions.includes("accounts_delete")) {
    try {
      const id = req.params.id;
      await Account.updateOne({
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
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
  } else {
    res.send(`403`);
  }
}
// [PATCH] /admin/accounts/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
  if (res.locals.role.permissions.includes("accounts_edit")) {
    try {
      const {
        id,
        statusChange
      } = req.params;
      await Account.updateOne({
        _id: id

      }, {
        status: statusChange
      });
      req.flash('success', 'Cập nhật trạng thái thành công!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
    // res.json() trả về api
    // res.redirect trả về route
    // res.render trả về file pug
  }
  else {
    res.send(`403`);
  }
}
// [PATCH] /admin/accounts/change-multi
module.exports.changeMulti = async (req, res) => {
  if (res.locals.role.permissions.includes("accounts_edit")) {
    try {
      const {
        status,
        ids
      } = req.body;
      switch (status) {
        case "active":
        case "inactive":
          await Account.updateMany({
            _id: ids
          }, {
            status: status
          });
          break;
        case "delete":
          await Account.updateMany({
            _id: ids
          }, {
            deleted: true
          });
          break;
        default:
          break;
      }
      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/accounts/trash
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
  const pagination = await paginationHelper.paginationAccount(req, find);
  // Hết phân trang
  //Sắp xếp
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.updatedAt = "desc";
  }
  // Hết sắp xếp
  const accounts = await Account
    .find(find)
    .limit(pagination.limitItems) // số lượng tối thiểu 
    .skip(pagination.skip) // bỏ qua
    .sort(sort);
  for (const item of accounts) {
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
  for (const account of accounts) {
    const role = await Role.findOne({
      _id: account.role_id,
      deleted: false
    });
    account.roleTitle = role.title;
  }

  res.render("admin/pages/accounts/trash", {
    pageTitle: "Trang thùng rác",
    accounts: accounts,
    keyword: keyword,
    filterStatus: filterStatus,
    pagination: pagination
  });
}
// [GET] /admin/accounts/trash/detail/:id

module.exports.detailTrash = async (req, res) => {
  try {
    const id = req.params.id;
    const account = await Account.findOne({
      _id: id,
      deleted: true
    });
    if (account) {
      const roles = await Role.findOne({
        _id: account.role_id,
        deleted: false
      });
      res.render("admin/pages/accounts/detail", {
        pageTitle: "Chi tiết sản phẩm",
        roles: roles,
        account: account
      });
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/accounts/trash`);
    }
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts/trash`);
  }
}
// [DELETE] /admin/accounts/trash/deletePermanently/:id
module.exports.deletePermanently = async (req, res) => {
  if (res.locals.role.permissions.includes("accounts_delete")) {
    try {
      const id = req.params.id;
      await Account.deleteOne({
        _id: id

      }, {
        deleted: true
      });
      req.flash('success', 'Xóa thành công!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts/trash`);
    }
  }
  else {
    res.send(`403`);
  }
}
// [PATCH] /admin/accounts/trash/restore/:id
module.exports.restore = async (req, res) => {
  if (res.locals.role.permissions.includes("accounts_edit")) {
    try {
      const id = req.params.id;
      await Account.updateOne({
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
      res.redirect(`/${systemConfig.prefixAdmin}/accounts/trash`);
    }
  }
  else {
    res.send(`403`);
  }
}
// [PATCH] /admin/products/trash/change-multi
module.exports.changeMultiRestore = async (req, res) => {
  if (res.locals.role.permissions.includes("accounts_edit")) {
    try {
      const {
        acts,
        ids
      } = req.body;
      switch (acts) {
        case "restore":
          await Account.updateMany({
            _id: ids
          }, {
            deleted: false
          });
          req.flash('success', 'Khôi phục thành công!');
          break;
        case "delete-permanently":
          await Account.deleteMany({
            _id: ids
          });
          req.flash('success', 'Xóa thành công!');
          break;
        default:
          break;
      }
      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts/trash`);
    }
  } else {
    res.send(`403`);
  }
}