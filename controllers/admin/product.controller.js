const Product = require("../../models/product.model");
const paginationHelper = require("../../helpers/pagination.helper");
const systemConfig = require("../../config/system");
const ProductCategory = require("../../models/product-category.model")
const createTreeHelper = require("../../helpers/createTree.helper");
const moment = require("moment");
const Account = require("../../models/accounts.model");

// [GET] /admin/products/
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  }
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
  const products = await Product
    .find(find)
    .limit(pagination.limitItems) // số lượng tối thiểu 
    .skip(pagination.skip) // bỏ qua
    .sort(sort);



  // console.log(products);
  for (const item of products) {
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
  res.render("admin/pages/products/index", {
    pageTitle: "Trang danh sách sản phẩm ",
    products: products,
    keyword: keyword,
    filterStatus: filterStatus,
    pagination: pagination
  });
}
// [PATCH] /admin/products/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
  if (res.locals.role.permissions.includes("products_edit")) {
    try {
      const {
        id,
        statusChange
      } = req.params;
      await Product.updateOne({
        _id: id

      }, {
        status: statusChange
      });
      req.flash('success', 'Cập nhật trạng thái thành công!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
    // res.json() trả về api
    // res.redirect trả về route
    // res.render trả về file pug
  }
  else {
    res.send(`403`);
  }
}
// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  if (res.locals.role.permissions.includes("products_edit")) {
    try {
      const {
        status,
        ids
      } = req.body;
      console.log(req.body);
      switch (status) {
        case "active":
        case "inactive":
          await Product.updateMany({
            _id: ids
          }, {
            status: status
          });
          req.flash('success', 'Cập nhật trạng thái thành công!');
          break;
        case "delete":
          await Product.updateMany({
            _id: ids
          }, {
            deleted: true
          });
          req.flash('success', 'Đã chuyển vào thùng rác!');
        default:
          break;
      }
      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
  } else {
    res.send(`403`);
  }
}
//[PATCH]/admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  if (res.locals.role.permissions.includes("products_delete")) {
    try {
      const id = req.params.id;
      await Product.updateOne({
        _id: id
      }, {

        deleted: true,
        deletedBy: res.locals.account.id
      });
      req.flash('success', 'Đã chuyển vào thùng rác!');
      res.json({
        code: 200
      })
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
  } else {
    res.send(`403`);
  }
}
// [PATCH]/admin/products/change-position/:id
module.exports.changePosition = async (req, res) => {
  if (res.locals.role.permissions.includes("products_edit")) {
    try {
      const id = req.params.id;
      const position = req.body.position;
      await Product.updateOne({
        _id: id
      }, {
        position: position
      });
      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  const categories = await ProductCategory.find({
    deleted: false
  });
  const newCategories = createTreeHelper(categories);
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    categories: newCategories
  });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  if (res.locals.role.permissions.includes("products_create")) {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countProducts = await Product.countDocuments({});
      req.body.position = countProducts + 1;
    }
    req.body.createdBy = res.locals.account.id;
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  } else {
    res.send("403");
  }
}
// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({
      _id: id,
      deleted: false
    });
    if (product) {
      const categories = await ProductCategory.find({
        deleted: false
      });
      const newCategories = createTreeHelper(categories);
      res.render("admin/pages/products/edit", {
        pageTitle: "Chỉnh sửa sản phẩm",
        product: product,
        categories: newCategories
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
}
// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  if (res.locals.role.permissions.includes("products_edit")) {
    try {
      const id = req.params.id;

      req.body.price = parseInt(req.body.price);
      req.body.discountPercentage = parseInt(req.body.discountPercentage);
      req.body.stock = parseInt(req.body.stock);
      if (req.body.position) {
        req.body.position = parseInt(req.body.position);
      } else {
        const countProducts = await Product.countDocuments({});
        req.body.position = countProducts + 1;
      }
      req.body.updatedBy = res.locals.account.id;
      await Product.updateOne({
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
// [GET] /admin/products/detail/:id

module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({
      _id: id,
      deleted: false
    });
    if (product) {
      res.render("admin/pages/products/detail", {
        pageTitle: "Chi tiết sản phẩm",
        product: product
      });
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}
// [GET] /admin/products/trash
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
  const products = await Product
    .find(find)
    .limit(pagination.limitItems) // số lượng tối thiểu 
    .skip(pagination.skip) // bỏ qua
    .sort(sort);
  // res.send("ok");
  // console.log(products);
  for (const item of products) {
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
  res.render("admin/pages/products/trash", {
    pageTitle: "Trang thùng rác",
    products: products,
    keyword: keyword,
    filterStatus: filterStatus,
    pagination: pagination
  });
}
// [PATCH] /admin/products/trash/restore/:id
module.exports.restore = async (req, res) => {
  if (res.locals.role.permissions.includes("products_edit")) {
    try {
      const id = req.params.id;
      await Product.updateOne({
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
// [DELETE] /admin/products/trash/deletePermanently/:id
module.exports.deletePermanently = async (req, res) => {
  if (res.locals.role.permissions.includes("products_delete")) {
    try {
      const id = req.params.id;
      await Product.deleteOne({
        _id: id

      }, {
        deleted: true
      });
      req.flash('success', 'Xóa thành công!');

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
// [PATCH] /admin/products/trash/change-multi
module.exports.changeMultiRestore = async (req, res) => {
  if (res.locals.role.permissions.includes("products_edit")) {
    try {
      const {
        acts,
        ids
      } = req.body;
      switch (acts) {
        case "restore":
          await Product.updateMany({
            _id: ids
          }, {
            deleted: false
          });
          break;
        case "delete-permanently":
          await Product.deleteMany({
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
      res.redirect(`/${systemConfig.prefixAdmin}/products/trash`);
    }
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/products/trash/detail/:id

module.exports.detailTrash = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({
      _id: id,
      deleted: true
    });
    if (product) {
      res.render("admin/pages/products/detail", {
        pageTitle: "Chi tiết sản phẩm",
        product: product
      });
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/products/trash`);
    }
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products/trash`);
  }
}