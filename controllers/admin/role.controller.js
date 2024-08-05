const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const Account = require("../../models/accounts.model");
const moment = require("moment");
//[GET] /admin/roles
module.exports.index = async (req, res) => {
  const records = await Role.find({
    deleted: false
  });
  for (const record of records) {
    // Người tạo
    if (record.createdBy) {
      const accountCreated = await Account.findOne({
        _id: record.createdBy
      });
      record.createdByFullName = accountCreated.fullName;
    } else {
      record.createdByFullName = "";
    }
    record.createdAtFormat = moment(record.createdAt).format("DD/MM/YY HH:mm:ss");
    // Người cập nhật
    if (record.updatedBy) {
      const accountUpdated = await Account.findOne({
        _id: record.updatedBy
      });
      record.updatedByFullName = accountUpdated.fullName;
    } else {
      record.updatedByFullName = "";
    }
    record.updatedAtFormat = moment(record.updatedAt).format("DD/MM/YY HH:mm:ss");
  }
  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    records: records
  });
}
//[GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo mới nhóm quyền",
  });
};
//[POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  if (res.locals.role.permissions.includes("roles_create")) {
    req.body.createdBy = res.locals.account.id;
    const records = new Role(req.body);
    await records.save();
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const records = await Role.findOne({
      _id: id,
      deleted: false
    });
    res.render("admin/pages/roles/edit", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      records: records
    }
    );

  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  if (res.locals.role.permissions.includes("roles_edit")) {
    try {
      const id = req.params.id;
      req.body.updatedBy = res.locals.account.id;
      await Role.updateOne({
        _id: id,
        deleted: false
      }, req.body);
      req.flash("success", "Cập nhật thành công!");
      res.redirect("back");

    } catch (error) {
      req.flash("error", "Id sản phẩm không hợp lệ !");
      res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  const records = await Role.find({
    deleted: false
  });

  res.render("admin/pages/roles/permissions", {
    pageTitle: "Phân quyền",
    records: records
  });
};
// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  if (res.locals.role.permissions.includes("roles_permissions")) {
    const roles = req.body;

    for (const role of roles) {
      await Role.updateOne({
        _id: role.id,
        deleted: false
      }, {
        permissions: role.permissions
      });
    }

    res.json({
      code: 200,
      message: "Cập nhật thành công!"
    });
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const records = await Role.findOne({
      _id: id,
      deleted: false
    });
    if (records) {
      res.render("admin/pages/roles/detail", {
        pageTitle: "Chi tiết",
        records: records
      }
      );
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
// [PATCH] /admin/roles/delete/:id
module.exports.deleteItem = async (req, res) => {
  if (res.locals.role.permissions.includes("roles_delete")) {
    try {
      const id = req.params.id;
      await Role.updateOne({
        _id: id
      }, {

        deleted: true
      });
      req.flash('success', 'Cập nhật trạng thái thành công!');
      res.json({
        code: 200
      })
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
  } else {
    res.send(`403`);
  }
}