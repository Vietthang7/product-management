module.exports.valiPassword = async (req, res, next) => {
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
