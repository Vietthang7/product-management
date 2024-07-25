module.exports.inFoUserOrder = async (req, res, next) => {
  if (!req.body.fullName || !req.body.phone || !req.body.address) {
    req.flash("error", "Vui lòng  điền đầy đủ thông tin!");
    res.redirect("back");
    return;
  }
  next();
}
