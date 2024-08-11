const Account = require("../../models/accounts.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");
const ForgotPassword = require("../../models/forgot-password.model");
const generateHelper = require("../../helpers/generate.helper");
const sendMailHelper = require("../../helpers/sendEmail.helper");
// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  res.render("admin/pages/auth/login", {
    pageTitle: "Đăng nhập"
  });
}
// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const account = await Account.findOne({
    email: email,
    deleted: false
  });

  if (!account) {
    req.flash("error", "Email không tồn tại trong hệ thống!");
    res.redirect("back");
    return;
  }
  if (md5(password) != account.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }
  if(account.status != "active"){
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }
  res.cookie("token",account.token);
  res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}
// [GET] /admin/auth/logout
module.exports.logOut = async (req, res) => {
 res.clearCookie("token");
 res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}
// [GET] /admin/auth/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("admin/pages/auth/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};
//[POST] /auth/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const account = await Account.findOne({
    email: email,
    deleted: false
  });
  if (!account) {
    req.flash("error", "Email không tồn tại trong hệ thống!");
    res.redirect("back");
    return;
  }
  const otp = generateHelper.generateRandomNumber(6);

  // Việc 1: Lưu email, OTP vào database
  const forgotPasswordData = {
    email: email,
    otp: otp,
    expireAt: Date.now() + 3 * 60 * 1000
  };
  const forgotPassword = new ForgotPassword(forgotPasswordData);
  await forgotPassword.save();


  // Việc 2: Gửi mã OTP qua email của account
  const subject = "Mã OTP lấy lại mật khẩu."
  const htmlSendMail =`Mã OTP xác thực của bạn là <b style = "color:green;"> ${otp} </b>.Mã OTP có hiệu lực trong 3 phút .Vui lòng không cung cấp mã OTP cho người khác`;
  sendMailHelper.sendMail(email,subject,htmlSendMail);
  res.redirect(`/${systemConfig.prefixAdmin}/auth/password/otp?email=${email}`);
};
//[GET]/auth/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("admin/pages/auth/otp-password", {
    pageTitle: "Xác thực mật khẩu",
    email: email
  });
};
//[POST]/auth/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if (!result) {
    req.flash("error", "OTP không hợp lệ");
    res.redirect("back");
    return;
  }
  const account = await Account.findOne({
    email: email
  });
  res.cookie("token", account.token);
  res.redirect(`/${systemConfig.prefixAdmin}/auth/password/reset`);
};
// [GET] /auth/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("admin/pages/auth/reset-password", {
    pageTitle: "Đổi lại mật khẩu mới",
  });
};
// [PATCH] /auth/password/reset
module.exports.resetPasswordPatch = async (req, res) => {
  if(req.body.password != req.body.confirmpassword){
    req.flash("error", "Mật khẩu không khớp");
    res.redirect("back");
    return;
  }
  const password = req.body.password;
  const tokenUser = req.cookies.token;
  await Account.updateOne({
    tokenUser : tokenUser,
    deleted : false
  },{
    password : md5(password)
  });
  res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
};
