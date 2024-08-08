const Product = require("../models/product.model");
const Account = require("../models/accounts.model");
const Post = require("../models/post.model");
const ProductCategory = require("../models/product-category.model");
const ArticleCategory = require("../models/article-category.model");
//Product
module.exports.paginationProduct = async (req, find) => {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination.skip = (pagination.currentPage - 1) * pagination.limitItems;

    const countProducts = await Product.countDocuments(find);
    const totalPage = Math.ceil(countProducts / pagination.limitItems);
    pagination.totalPage = totalPage;
    return pagination;
}
// ProductCategory
module.exports.paginationProductCategory = async (req, find) => {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination.skip = (pagination.currentPage - 1) * pagination.limitItems;

    const countProductCategory = await ProductCategory.countDocuments(find);
    const totalPage = Math.ceil(countProductCategory / pagination.limitItems);
    pagination.totalPage = totalPage;
    return pagination;
}
//Account
module.exports.paginationAccount = async (req, find) => {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination.skip = (pagination.currentPage - 1) * pagination.limitItems;

    const countAcounts = await Account.countDocuments(find);
    const totalPage = Math.ceil(countAcounts / pagination.limitItems);
    pagination.totalPage = totalPage;
    return pagination;
}
// Post
module.exports.paginationPost = async (req, find) => {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination.skip = (pagination.currentPage - 1) * pagination.limitItems;

    const countPosts = await Post.countDocuments(find);
    const totalPage = Math.ceil(countPosts / pagination.limitItems);
    pagination.totalPage = totalPage;
    return pagination;
}
//ArticleCategory
module.exports.paginationArticleCategory = async (req, find) => {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination.skip = (pagination.currentPage - 1) * pagination.limitItems;

    const countPosts = await ArticleCategory.countDocuments(find);
    const totalPage = Math.ceil(countPosts / pagination.limitItems);
    pagination.totalPage = totalPage;
    return pagination;
}
//End ArticleCategory

