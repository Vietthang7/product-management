const homeRoute = require("./home.route");
const productRoute = require("./product.route");
const categoryMiddleware = require("../../middlewares/client/category.middlewares");
const searchRoute = require("./search.route");
<<<<<<< HEAD
const cartRoute = require("./cart.route");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
=======
>>>>>>> cac6c1d102d7e7e73b7c7ab18abaf39a6818884c
module.exports.index = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use("/", homeRoute);
    app.use("/search",searchRoute);
    app.use("/products", productRoute);
    app.use("/cart", cartRoute);
}