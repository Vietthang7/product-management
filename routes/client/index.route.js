const homeRoute = require("./home.route");
const productRoute = require("./product.route");
const categoryMiddleware = require("../../middlewares/client/category.middlewares");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
module.exports.index = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use("/", homeRoute);
    app.use("/search",searchRoute);
    app.use("/products", productRoute);
    app.use("/cart", cartRoute);
}