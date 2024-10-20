const homeRoute = require("./home.route");
const productRoute = require("./product.route");
const categoryMiddleware = require("../../middlewares/client/category.middlewares");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const checkoutRoute = require("./checkout.route");
const userRoute = require("./user.route");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const chatRoute = require("./chat.route");
const usersRoute = require("./users.route");
const postRoute = require("./post.route");
const roomChatRoute = require("./rooms-chat.route");
module.exports.index = (app) => {
    app.use(categoryMiddleware.productCategory);
    app.use(categoryMiddleware.articleCategory);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.infoUser);
    app.use(settingMiddleware.setting);
    app.use("/", homeRoute);
    app.use("/search",searchRoute);
    app.use("/products", productRoute);
    app.use("/cart", cartRoute);
    app.use("/checkout",checkoutRoute);
    app.use("/user",userRoute);
    app.use("/posts",postRoute);
    app.use("/chat",userMiddleware.requireAuth,chatRoute);
    app.use("/rooms-chat",userMiddleware.requireAuth,roomChatRoute);
    app.use("/users",userMiddleware.requireAuth,usersRoute);
}