const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const systemConfig = require("../../config/system");
const productCategoryRoute = require("./product-category.route");
const rolesRoute = require("./role.route");
const accountsRoute = require("./account.route");
const authRoute = require("./auth.route");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
const profileRoute = require("./profile.route");
const settingRoute = require("./setting.route");
const postRoute = require("./post.route");
const articleCategoryRoute = require("./article-category.route");
const userRoute = require("./user.route");

module.exports.index = (app) => {
    const path = `/${systemConfig.prefixAdmin}`;

    app.use(`${path}/dashboard`,
        authMiddleware.requireAuth,
        dashboardRoute);
    app.use(`${path}/products`,
        authMiddleware.requireAuth,
        productRoute);
    app.use(`${path}/products-category`,
        authMiddleware.requireAuth,
        productCategoryRoute);
    app.use(`${path}/roles`,
        authMiddleware.requireAuth,
        rolesRoute);
    app.use(`${path}/accounts`,
        authMiddleware.requireAuth, 
        accountsRoute);
    app.use(`${path}/profile`,
        authMiddleware.requireAuth, 
        profileRoute);
    app.use(`${path}/settings`,
        authMiddleware.requireAuth, 
        settingRoute);
    app.use(`${path}/posts`,
        authMiddleware.requireAuth, 
        postRoute);
    app.use(`${path}/article-category`,
        authMiddleware.requireAuth, 
        articleCategoryRoute);
    app.use(`${path}/users`,
        authMiddleware.requireAuth, 
        userRoute);
    app.use(`${path}/auth`, authRoute);
}

