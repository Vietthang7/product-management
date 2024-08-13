const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree.helper");
const ArticleCategory = require("../../models/article-category.model");
module.exports.productCategory = async (req, res, next) => {
  const categoryProducts = await ProductCategory.find({
    deleted: false,
    status: "active"
  });
  const newCategoryProducts = createTreeHelper(categoryProducts);
  res.locals.layoutCategoryProducts = newCategoryProducts;
  next();
}
module.exports.articleCategory = async (req, res, next) => {
  const categoryArticle = await ArticleCategory.find({
    deleted: false,
    status: "active"
  });
  const newCategoryArticle = createTreeHelper(categoryArticle);
  res.locals.layoutCategoryArticle = newCategoryArticle;
  next();
}