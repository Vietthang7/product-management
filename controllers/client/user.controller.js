const md5 = require("md5");
const generateHelper = require("../../helpers/generate.helper");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helpers/sendEmail.helper");
//[GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng kí tài khoản"
  });
};
//[POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existUser = await User.findOne({
    email: req.body.email,
    deleted: false
  })
  if (existUser) {
    req.flash("error", "Email đã tồn tại");
    res.redirect("back");
    return;
  }
  if (req.body.password != req.body.confirmpassword) {
    req.flash("error", "Mật khẩu không khớp");
    res.redirect("back");
    return;
  }
  const userData = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: md5(req.body.password),
    tokenUser: generateHelper.generateRandomString(30),
  };
  const user = new User(userData);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);
  req.flash("success", "Đăng kí tài khoản thành công");
  res.redirect("/");
};
//[GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản"
  });
};

//[POST] /user/login
module.exports.loginPost = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    deleted: false
  });
  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect("back");
    return;
  }
  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã dừng hoạt động!");
    res.redirect("back");
    return;
  }

  if (md5(req.body.password) != user.password) {
    req.flash("error", "Sai mật khẩu");
    res.redirect("back");
    return;
  }

  if (user.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa");
    res.redirect("back");
    return;
  }

  const expires = 3 * 24 * 60 * 60 * 1000;
  res.cookie(
    "tokenUser",
    user.tokenUser,
    {
      expires: new Date(Date.now() + expires)
    });
  await User.updateOne({
    email: req.body.email,
    deleted: false
  }, {
    statusOnline: "online"
  })
  _io.once("connection", (socket) => {
    // Trả ra cho bạn bè trạng thái online của A
    socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", {
      status: "online",
      userIdA: user.id
    })
  })
  req.flash("success", "Đăng nhập thành công!");
  res.redirect("/");

};
//[GET] /user/logout
module.exports.logout = async (req, res) => {
  try {
    await User.updateOne({
      _id: res.locals.user.id
    }, {
      statusOnline: "offline"
    })
  } catch (error) {
    console.log(e);
  }
  _io.once("connection", (socket) => {
    // Trả ra cho bạn bè trạng thái offline của A
    socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", {
      status: "offline",
      userIdA: res.locals.user.id
    })
  })
  res.clearCookie("tokenUser");
  res.redirect("/user/login");
};

//[GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};

//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại trong hệ thống!");
    res.redirect("back");
    return;
  }
  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã dừng hoạt động!");
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


  // Việc 2: Gửi mã OTP qua email của user 
  const subject = "Mã OTP lấy lại mật khẩu."
  const htmlSendMail = `Mã OTP xác thực của bạn là <b style = "color:green;"> ${otp} </b>.Mã OTP có hiệu lực trong 3 phút .Vui lòng không cung cấp mã OTP cho người khác`;
  sendMailHelper.sendMail(email, subject, htmlSendMail);
  res.redirect(`/user/password/otp?email=${email}`);
};

//[GET]/user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password", {
    pageTitle: "Xác thực mật khẩu",
    email: email
  });
};

//[POST]/user/password/otp
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
  const user = await User.findOne({
    email: email
  });
  res.cookie("tokenUser", user.tokenUser);
  res.redirect(`/user/password/reset`);
};


// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi lại mật khẩu mới",
  });
};


// [PATCH] /user/password/reset
module.exports.resetPasswordPatch = async (req, res) => {
  if (req.body.password != req.body.confirmpassword) {
    req.flash("error", "Mật khẩu không khớp");
    res.redirect("back");
    return;
  }
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;
  await User.updateOne({
    tokenUser: tokenUser,
    deleted: false
  }, {
    password: md5(password)
  });
  res.redirect("/");
};
//[GET] /user/profile
module.exports.profile = async (req, res) => {
  res.render("client/pages/user/profile", {
    pageTitle: "Thông tin cá nhân"
  });
};
//[GET] /user/password-old
module.exports.oldPassword = async (req, res) => {
  res.render("client/pages/user/oldPassword", {
    pageTitle: "Nhập mật khẩu cũ"
  });
};
//[POST] /user/password-old
module.exports.oldPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;
  const existUser = await User.findOne({
    tokenUser: tokenUser,
    deleted: false
  });
  if (md5(req.body.password) != existUser.password) {
    req.flash("error", "Sai mật khẩu");
    res.redirect("back");
    return;
  }
  res.redirect(`/user/password/reset`)
};
// [GET] /user/editProfile
module.exports.editProfile = async (req, res) => {
  res.render("client/pages/user/edit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân"
  });
}
// [PATCH] /user/edit
module.exports.editPatch = async (req, res) => {
  try {
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne({
      tokenUser: tokenUser,
      deleted: false
    }, req.body);
    req.flash("success", "Cập nhật thông tin thành công!");

  } catch (error) {
    req.flash("error", "Cập nhật không thành công!");
  }
  res.redirect("back");
}
