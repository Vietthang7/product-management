const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

//[GET] /admin/roles
module.exports.index = async (req, res) => {
  const records = await Role.find({
    deleted:false
  });
  res.render("admin/pages/roles/index",{
    pageTitle : "Nhóm quyền",
    records:records
  });
}
//[GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create",{
    pageTitle : "Tạo mới nhóm quyền",
  });
};
//[POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const records = new Role(req.body);
  await records.save();
  res.redirect(`/${systemConfig.prefixAdmin}/roles`);
};
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
      records:records
    }
    );

  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne({
      _id: id,
      deleted: false
    }, req.body);
    req.flash("success", "Cập nhật sản phẩm thành công!");
    res.redirect("back");

  } catch (error) {
    req.flash("error", "Id sản phẩm không hợp lệ !");
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
  }
};
