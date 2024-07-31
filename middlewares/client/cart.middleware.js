const Cart = require("../../models/cart.model");
module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();
    const expires = 365 * 24 * 60 * 60 * 1000;
    res.cookie(
      "cartId",
      cart.id,
      {
        expires: new Date(Date.now() + expires)
      });
  } else {
    const cart = await Cart.findOne({
      _id: req.cookies.cartId
    });
    if (cart) {
      res.locals.cartTotal = cart.products.length || 0;
    } else {
      // Nếu không tìm thấy cart, bạn có thể quyết định tạo mới hoặc xử lý theo cách khác  
      const newCart = new Cart();
      await newCart.save();
      const expires = 365 * 24 * 60 * 60 * 1000;
      res.cookie("cartId", newCart.id, {
        expires: new Date(Date.now() + expires)
      });
      res.locals.cartTotal = 0; // Hoặc bất kỳ giá trị nào bạn muốn gán  
    }
  }
  next();
}