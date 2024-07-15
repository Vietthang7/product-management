const Role = require("../../models/role.model");
const md5 = require('md5');
const systemConfig = require("../../config/system");
const Account = require("../../models/accounts.model");
const generateHelper = require("../../helpers/generate.helper");
const paginationHelper = require("../../helpers/pagination.helper");

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

  //Phân trang
  const pagination = await paginationHelper(req, find);
  //Hết  Phân trang

  const records = await Account
    .find(find)
    .limit(pagination.limitItems) // số lượng tối thiểu 
    .skip(pagination.skip) // bỏ qua

  for (const record of records) {
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
    req.body.password = md5(req.body.password);
    req.body.token = generateHelper.generateRandomString(30);
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

      await Account.updateOne({
        _id: id,
        deleted: false
      }, req.body);
      req.flash("success", "Cập nhật thành công!");
    } catch (error) {
      req.flash("error", "Id sản phẩm không hợp lệ!");
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
      console.log(roles);
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

        deleted: true
      });
      req.flash('success', 'Cập nhật trạng thái thành công!');
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
// [PATCH] /admin/products/change-status/:statusChange/:id
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