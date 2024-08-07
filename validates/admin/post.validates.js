module.exports.createPost = async (req, res, next) => {
  if(!req.body.title || !req.body.description) {
    req.flash("error", "Tiêu đề và nội dung không được để trống!");
    res.redirect("back");
    return;
  }
  next();
}
