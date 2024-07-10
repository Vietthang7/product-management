const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree.helper");
// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  const records = await ProductCategory.find({
    deleted: false
  });
  // console.log(records);
  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: records
  }
  );
}
// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  const categories = await ProductCategory.find({
    deleted: false
  });
  const newCategories = createTreeHelper(categories);
  res.render("admin/pages/products-category/create", {
    pageTitle: "Thêm mới danh mục sản phẩm",
    categories: newCategories
  }
  );
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const countCategory = await ProductCategory.countDocuments({});
    req.body.position = countCategory + 1;
  }
  const newCategory = new ProductCategory(req.body);
  await newCategory.save();
  res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
}
// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const categories = await ProductCategory.find({
      deleted: false
    });
    const category = await ProductCategory.findOne({
      _id: id,
      deleted: false
    });

    const newCategories = createTreeHelper(categories);
    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa danh mục",
      categories: newCategories,
      category: category
    }
    );

  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
}
// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countCategory = await ProductCategory.countDocuments({});
      req.body.position = countCategory + 1;
    }
    await ProductCategory.updateOne({
      _id: id,
      deleted: false
    }, req.body);
    req.flash("success", "Cập nhật sản phẩm thành công!");

  } catch (error) {
    req.flash("error", "Id sản phẩm không hợp lệ !");
  }
  res.redirect("back");
}