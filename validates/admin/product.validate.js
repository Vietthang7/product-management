module.exports.createPost = async (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", "Tiêu đề không được để trống!");
    res.redirect("back");
    return;
  }
  next();
}
module.exports.inFoClient = async (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Tên khách hàng không được để trống!");
    res.redirect("back");
    return;
  }
  if (!req.body.phone) {
    req.flash("error", "Tên khách hàng không được để trống!");
    res.redirect("back");
    return;
  }
  if (!req.body.address) {
    req.flash("error", "Tên khách hàng không được để trống!");
    res.redirect("back");
    return;
  }
  next();
}
