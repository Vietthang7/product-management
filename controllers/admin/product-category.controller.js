const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree.helper");
const paginationHelper = require("../../helpers/pagination.helper");
// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  };
  const filterStatus = [{
    label: "Tất cả",
    value: ""
  },
  {
    label: "Đang hoạt động",
    value: "active"
  },
  {
    label: "Dừng hoạt động",
    value: "inactive"
  },
  ];
  if (req.query.status) {
    find.status = req.query.status;
  }
  // Tìm kiếm
  let keyword = "";
  if (req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i");
    find.title = regex;
    keyword = req.query.keyword;
  }
  //Hết tìm kiếm

  //Phân trang
  const pagination = await paginationHelper(req, find);
  //Hết Phân trang
  const records = await ProductCategory
    .find(find)
    .limit(pagination.limitItems)
    .skip(pagination.skip)
  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: records,
    keyword: keyword,
    filterStatus: filterStatus,
    pagination: pagination
  }
  );
}
// [PATCH] /admin/products-category/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
  const {
    id, statusChange
  } = req.params;
  await ProductCategory.updateOne({
    _id: id
  }, {
    status: statusChange
  });
  req.flash('success', 'Cập nhật trạng thái thành công!');

  res.json({
    code: 200
  });

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
// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const productCategory = await ProductCategory.findOne({
      _id: id,
      deleted: false
    });
    if (productCategory) {
      res.render("admin/pages/products-category/detail", {
        pageTitle: "Chi tiết sản phẩm",
        productCategory: productCategory
      });
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
}
// [PATCH] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await ProductCategory.updateOne({
    _id: id
  }, {
    deleted: true
  });
  req.flash('success', 'Cập nhật trạng thái thành công!');
  res.json({
    code: 200,
  });
};
// [PATCH] /admin/products-category/change-position/:id
module.exports.changePosition = async (req, res) => {
  const id = req.params.id;
  const position = req.body.position;
  await ProductCategory.updateOne({
    _id: id
  }, {
    position: position
  });
  res.json({
    code: 200,
  });
};