const Setting = require("../../models/setting.model");
//[GET] /admin/setting/general
module.exports.general = async (req, res) => {
  const setting = await Setting.findOne({});
  res.render("admin/pages/settings/general", {
    pageTitle: "Cài đặt chung",
    setting: setting
  });
}
//[PATCH] /admin/setting/general
module.exports.generalPatch = async (req, res) => {
  if (res.locals.role.permissions.includes("settings-general_edit")) {
    const setting = await Setting.findOne({});
    if (setting) {
      await Setting.updateOne({
        _id: setting.id
      }, req.body);
    }
    else {
      const record = new Setting(req.body);
      await record.save();
    }
    res.redirect("back");
  }
}