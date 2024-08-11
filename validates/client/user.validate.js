module.exports.infoUser = async (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng điền đầy đủ họ tên!");
    res.redirect("back");
    return;
  }
  if (!req.body.email) {
    req.flash("error", "Vui lòng điền đầy đủ thông tin email !");
    res.redirect("back");
    return;
  }
  next();
}
module.exports.Register = async (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Vui lòng điền đầy đủ thông tin email !");
    res.redirect("back");
    return;
  }
  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu");
    res.redirect("back");
    return;
  }
  const minLength = 8;
  if (req.body.password.length < minLength) {
    req.flash("error", "Mật khẩu tối thiểu có 8 kí tự");
    res.redirect("back");
    return;
  }
  next();
}

