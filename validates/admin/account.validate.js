module.exports.createPostAccount = async (req, res, next) => {
  if (!req.body.email || !req.body.fullName || !req.body.password) {
    req.flash("error", "Vui lòng điền đầy đủ thông tin!");
    res.redirect("back");
    return;
  }
  next();
}
