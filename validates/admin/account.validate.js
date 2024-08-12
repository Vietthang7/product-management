module.exports.editPatchAccount = async (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng điền đầy đủ họ tên!");
    res.redirect("back");
    return;
  }
  if (!req.body.email) {
    req.flash("error", "Vui lòng điền đầy đủ email!");
    res.redirect("back");
    return;
  }
  if (req.body.password) {
    const minLength = 8;  
  const password = req.body.password;  
  const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/; // Pattern để kiểm tra ký tự đặc biệt  
  const numberPattern = /\d/; // Pattern để kiểm tra số  

  if (password.length < minLength) {  
    req.flash("error", "Mật khẩu tối thiểu có 8 kí tự");  
    res.redirect("back");  
    return;  
  }  

  if (!/[a-zA-Z]/.test(password)) {  
    req.flash("error", "Mật khẩu phải có ít nhất một chữ cái");  
    res.redirect("back");  
    return;  
  }  

  if (!numberPattern.test(password)) {  
    req.flash("error", "Mật khẩu phải có ít nhất một số");  
    res.redirect("back");  
    return;  
  }  

  if (!specialCharPattern.test(password)) {  
    req.flash("error", "Mật khẩu phải có ít nhất một ký tự đặc biệt");  
    res.redirect("back");  
    return;  
  }
  }
  next();
}
module.exports.createPostAccount = async (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng điền đầy đủ họ tên!");
    res.redirect("back");
    return;
  }
  if (!req.body.email) {
    req.flash("error", "Vui lòng điền đầy đủ email!");
    res.redirect("back");
    return;
  }
  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu");
    res.redirect("back");
    return;
  }
  const minLength = 8;  
  const password = req.body.password;  
  const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/; // Pattern để kiểm tra ký tự đặc biệt  
  const numberPattern = /\d/; // Pattern để kiểm tra số  

  if (password.length < minLength) {  
    req.flash("error", "Mật khẩu tối thiểu có 8 kí tự");  
    res.redirect("back");  
    return;  
  }  

  if (!/[a-zA-Z]/.test(password)) {  
    req.flash("error", "Mật khẩu phải có ít nhất một chữ cái");  
    res.redirect("back");  
    return;  
  }  

  if (!numberPattern.test(password)) {  
    req.flash("error", "Mật khẩu phải có ít nhất một số");  
    res.redirect("back");  
    return;  
  }  

  if (!specialCharPattern.test(password)) {  
    req.flash("error", "Mật khẩu phải có ít nhất một ký tự đặc biệt");  
    res.redirect("back");  
    return;  
  }
  next();
}
