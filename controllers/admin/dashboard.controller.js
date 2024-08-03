const Product = require("../../models/product.model");
const Account = require("../../models/accounts.model");
const categoryProduct = require("../../models/product-category.model");
const User = require("../../models/user.model");
module.exports.index = async (req, res) => {
    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
        }
    }
    //product
    statistic.product.total = await Product.countDocuments({
        deleted: false
    });
    statistic.product.active = await Product.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.product.inactive = await Product.countDocuments({
        deleted: false,
        status: "inactive"
    });
    //End product 

    //category
    statistic.categoryProduct.total = await categoryProduct.countDocuments({
        deleted: false
    });
    statistic.categoryProduct.active = await categoryProduct.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.categoryProduct.inactive = await categoryProduct.countDocuments({
        deleted: false,
        status: "inactive"
    });
    // End category

    //account
    statistic.account.total = await Account.countDocuments({
        deleted: false
    });
    statistic.account.active = await Account.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.account.inactive = await Account.countDocuments({
        deleted: false,
        status: "inactive"
    });
    // end account

    // User
    statistic.user.total = await User.countDocuments({
        deleted: false
    });
    statistic.user.active = await User.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.user.inactive = await User.countDocuments({
        deleted: false,
        status: "inactive"
    });
    //  End User
    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tổng quan",
        statistic: statistic
    })
}