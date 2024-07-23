const homeRoute = require("./home.route");
const productRoute = require("./product.route");
const categoryMiddleware = require("../../middlewares/client/category.middlewares");
const searchRoute = require("./search.route");
module.exports.index = (app) => {
    app.use(categoryMiddleware.category);
    app.use("/", homeRoute);
    app.use("/search",searchRoute);
    app.use("/products", productRoute);
}