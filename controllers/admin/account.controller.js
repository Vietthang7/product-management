const Role = require("../../models/role.model");
const md5 = require('md5');
const systemConfig = require("../../config/system");
const Account = require("../../models/accounts.model");
const generateHelper = require("../../helpers/generate.helper");
// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  const records = await Account.find({
    deleted:false
  });
  for(const record of records) {
    const role = await Role.findOne({
      _id : record.role_id,
      deleted:false
    });
    record.roleTitle = role.title;
  }
  res.render("admin/pages/accounts/index",{
      pageTitle : "Tài khoản admin",
      records: records
  }
  );
}
// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted:false
  }).select("title");
  res.render("admin/pages/accounts/create",{
      pageTitle : "Tài khoản admin",
      roles:roles
  }
  );
}
// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  req.body.password = md5(req.body.password);
  req.body.token = generateHelper.generateRandomString(30);
  const account = new Account(req.body);
  await account.save();
  res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}