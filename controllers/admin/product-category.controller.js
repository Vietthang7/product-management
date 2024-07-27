const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const moment = require("moment");
const Account = require("../../models/accounts.model");

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
  //Sắp xếp
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  } else {
    sort.position = "desc";
  }
  const records = await ProductCategory
    .find(find)
    .limit(pagination.limitItems)
    .skip(pagination.skip)
    .sort(sort)
  for (const item of records) {
    if (item.createdBy) {
      const accountCreated = await Account.findOne({
        _id: item.createdBy
      });
      item.createdByFullName = accountCreated.fullName;
    } else {
      item.createdByFullName = "";
    }
    item.createdAtFormat = moment(item.createdAt).format("DD/MM/YY HH:mm:ss");
    // Người cập nhật
    if (item.updatedBy) {
      const accountUpdated = await Account.findOne({
        _id: item.updatedBy
      });
      item.updatedByFullName = accountUpdated.fullName;
    } else {
      item.updatedByFullName = "";
    }

    item.updatedAtFormat = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
  }
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
  if (res.locals.role.permissions.includes("products-category_edit")) {
    try {
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
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }

  } else {
    res.send(`403`);
  }
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
  if (res.locals.role.permissions.includes("products-category_create")) {
    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countCategory = await ProductCategory.countDocuments({});
      req.body.position = countCategory + 1;
    }
    req.body.createdBy = res.locals.account.id;
    const newCategory = new ProductCategory(req.body);
    await newCategory.save();
    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
  } else {
    res.send(`403`);
  }
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
  if (res.locals.role.permissions.includes("products-category_edit")) {
    try {
      const id = req.params.id;
      if (req.body.position) {
        req.body.position = parseInt(req.body.position);
      } else {
        const countCategory = await ProductCategory.countDocuments({});
        req.body.position = countCategory + 1;
      }
      req.body.updatedBy = res.locals.account.id;
      await ProductCategory.updateOne({
        _id: id,
        deleted: false
      }, req.body);
      req.flash("success", "Cập nhật sản phẩm thành công!");

    } catch (error) {
      req.flash("error", "Id sản phẩm không hợp lệ !");
    }
    res.redirect("back");
  } else {
    res.send(`403`);
  }
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
  if (res.locals.role.permissions.includes("products-category_delete")) {
    try {
      const id = req.params.id;
      await ProductCategory.updateOne({
        _id: id
      }, {
        deleted: true,
        deletedBy: res.locals.account.id
      });
      req.flash('success', 'Đã chuyển vào thùng rác!');
      res.json({
        code: 200,
      });
    } catch (error) {
      res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
  } else {
    res.send(`403`);
  }
}
// [PATCH] /admin/products-category/change-position/:id
module.exports.changePosition = async (req, res) => {
  if (res.locals.role.permissions.includes("products-category_edit")) {

    try {
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
    } catch (error) {
      res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
  } else {
    res.send(`403`);
  }
}
// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
  if (res.locals.role.permissions.includes("products-category_edit")) {
    try {
      const {
        status,
        ids
      } = req.body;
      console.log(req.body);
      switch (status) {
        case "active":
        case "inactive":
          await ProductCategory.updateMany({
            _id: ids
          }, {
            status: status
          });
          break;
        case "delete":
          await ProductCategory.updateMany({
            _id: ids
          }, {
            deleted: true
          });
        default:
          break;
      }
      req.flash('success', 'Cập nhật trạng thái thành công!');
      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/products-category/trash
module.exports.trash = async (req, res) => {
  const find = {
    deleted: true
  }
  const filterStatus = [{
    label: "Tất cả",
    value: ""
  }, {
    label: "Đang hoạt động",
    value: "active"
  }, {
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
  // Hết tìm kiếm

  // Phân trang
  const pagination = await paginationHelper(req, find);
  // Hết phân trang
  //Sắp xếp
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // Hết sắp xếp
  const productCategory = await ProductCategory
    .find(find)
    .limit(pagination.limitItems) // số lượng tối thiểu 
    .skip(pagination.skip) // bỏ qua
    .sort(sort);
  for (const item of productCategory) {
    if (item.createdBy) {
      const accountCreated = await Account.findOne({
        _id: item.createdBy
      });
      item.createdByFullName = accountCreated.fullName;
    } else {
      item.createdByFullName = "";
    }
    item.createdAtFormat = moment(item.createdAt).format("DD/MM/YY HH:mm:ss");
    if (item.updatedBy) {
      const accountUpdated = await Account.findOne({
        _id: item.updatedBy
      });
      item.updatedByFullName = accountUpdated.fullName;
    } else {
      item.updatedByFullName = "";
    }

    item.updatedAtFormat = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
    if (item.deletedBy) {
      const accountDeleted = await Account.findOne({
        _id: item.deletedBy
      });
      item.deletedByFullName = accountDeleted.fullName;
    } else {
      item.deletedByFullName = "";
    }

    item.updatedAtFormat = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
  }
  res.render("admin/pages/products-category/trash", {
    pageTitle: "Trang thùng rác",
    productCategory: productCategory,
    keyword: keyword,
    filterStatus: filterStatus,
    pagination: pagination
  });
}
// [GET] /admin/products-category/detail/:id
module.exports.detailTrash = async (req, res) => {
  try {
    const id = req.params.id;
    const productCategory = await ProductCategory.findOne({
      _id: id,
      deleted: true
    });
    if (productCategory) {
      res.render("admin/pages/products-category/detail", {
        pageTitle: "Chi tiết sản phẩm",
        productCategory: productCategory
      });
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/products-category/trash`);
    }
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category/trash`);
  }
}
// [PATCH] /admin/products-category/restore/:id
module.exports.restore = async (req, res) => {
  if (res.locals.role.permissions.includes("products-category_edit")) {
    try {
      const id = req.params.id;
      await ProductCategory.updateOne({
        _id: id
      }, {
        deleted: false,
        updatedBy: res.locals.account.id
      });
      req.flash('success', 'Khôi phục thành công!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/products/trash`);
    }
  }
  else {
    res.send(`403`);
  }
}
// [DELETE] /admin/products-catgory/deletePermanently/:id
module.exports.deletePermanently = async (req, res) => {
  if (res.locals.role.permissions.includes("products-category_delete")) {
    try {
      const id = req.params.id;
      console.log(id);
      await ProductCategory.deleteOne({
        _id: id

      }, {
        deleted: true
      });
      req.flash('success', 'Xóa thành công!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/products-category/trash`);
    }
  }
  else {
    res.send(`403`);
  }
}
// [PATCH] /admin/products-category/trash/change-multi
module.exports.changeMultiRestore = async (req, res) => {
  if (res.locals.role.permissions.includes("products-category_edit")) {
    try {
      const {
        acts,
        ids
      } = req.body;
      switch (acts) {
        case "restore":
          await ProductCategory.updateMany({
            _id: ids
          }, {
            deleted: false
          });
          break;
        case "delete-permanently":
          await ProductCategory.deleteMany({
            _id: ids
          });
          break;
        default:
          break;
      }
      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/products-category/trash`);
    }
  } else {
    res.send(`403`);
  }
}