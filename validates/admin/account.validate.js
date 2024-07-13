module.exports.createPostAccount = async (req, res, next) => {
  if(!req.body.email && !req.body.fullName && !req.body.password) {
    req.flash("error", "Tiêu đề không được để trống!");
    res.redirect("back");
    return;
  }
  next();
}
