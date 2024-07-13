const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const systemConfig = require("../../config/system");
const productCategoryRoute = require("./product-category.route");
const rolesRoute = require("./role.route");
const accountsRoute = require("./account.route");
const authRoute = require("./auth.route");

module.exports.index = (app) => {
    const path = `/${systemConfig.prefixAdmin}`;

    app.use(`${path}/dashboard`, dashboardRoute);

    app.use(`${path}/products`, productRoute);
    app.use(`${path}/products-category`, productCategoryRoute);
    app.use(`${path}/roles`, rolesRoute);
    app.use(`${path}/accounts`, accountsRoute);
    app.use(`${path}/auth`, authRoute);
}

