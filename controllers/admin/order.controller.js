const paginationHelper = require("../../helpers/pagination.helper");
const systemConfig = require("../../config/system");
const moment = require("moment");
const Account = require("../../models/accounts.model");
const Order = require("../../models/order.model");
const mongoose = require('mongoose');
const Product = require("../../models/product.model"); 
// [GET] /admin/orders
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };
  const filterStatus = [{
    label: "Tất cả",
    value: ""
  },
  {
    label: "Đã xác nhận",
    value: "active"
  },
  {
    label: "Chưa xác nhận",
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
    find = {  
      $or: [  
          { 'userInfo.fullName': regex }, // Tìm theo tên khách hàng  
          mongoose.Types.ObjectId.isValid(req.query.keyword) ? { '_id': new mongoose.Types.ObjectId(req.query.keyword) } : { _id: null } // Tìm theo ID đơn hàng nếu hợp lệ
      ]  
  };
    keyword = req.query.keyword;
  }
  // Hết tìm kiếm

  // Phân trang
  const pagination = await paginationHelper.paginationOrder(req, find);

  // Hết phân trang
  //Sắp xếp
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.createdAt = "desc";
  }
  // Hết sắp xếp
  const orders = await Order
    .find(find)
    .limit(pagination.limitItems) // số lượng tối thiểu 
    .skip(pagination.skip) // bỏ qua
    .sort(sort);

  for (const item of orders) {
    if (item.userInfo.fullName) {
      const userCreated = item.userInfo.fullName
      item.createdByFullName = userCreated;
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

    // Tính tổng giá đơn hàng
    item.totalPrice = 0;
    if (item.products.length > 0) {
      for (const product of item.products){
        const priceNew = (1 - product.discountPercentage / 100) * product.price;
        const totalPrice = priceNew * product.quantity;
        item.totalPrice += totalPrice;
      }
    }
    await item.save();
  }
  res.render("admin/pages/orders/index", {
    pageTitle: "Trang danh sách đơn hàng",
    orders: orders,
    keyword: keyword,
    filterStatus: filterStatus,
    pagination: pagination
  });
}
// [PATCH] /admin/orders/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
  if (res.locals.role.permissions.includes("orders_edit")) {
    try {
      const {
        id,
        statusChange
      } = req.params;
      await Order.updateOne({
        _id: id

      }, {
        status: statusChange
      });
      req.flash('success', 'Cập nhật trạng thái thành công!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/oders`);
    }
  }
  else {
    res.send(`403`);
  }
}
// [PATCH] /admin/orders/change-multi
module.exports.changeMulti = async (req, res) => {
  if (res.locals.role.permissions.includes("orders_edit")) {
    try {
      const {
        status,
        ids
      } = req.body;
      switch (status) {
        case "active":
        case "inactive":
          await Order.updateMany({
            _id: ids
          }, {
            status: status
          });
          req.flash('success', 'Cập nhật trạng thái thành công!');
          break;
        case "delete":
          await Order.updateMany({
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
      res.redirect(`/${systemConfig.prefixAdmin}/orders`);
    }
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/orders/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findOne({
      _id: id,
      deleted: false
    });
    if(order.products.length > 0){
      for (const product of order.products){
        const productInfo = await Product.findOne({
          _id: product.productId
        }).select("title thumbnail slug price discountPercentage");
        productInfo.priceNew = (1 - productInfo.discountPercentage / 100) * productInfo.price;
        product.productInfo = productInfo;
        product.totalPrice = productInfo.priceNew * product.quantity;
      }
    if (order) {
      res.render("admin/pages/orders/edit", {
        pageTitle: "Chỉnh sửa đơn hàng",
        order: order,
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/orders`);
    }
  }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/orders`);
  }
}
//[PATCH] /orders/update/:id/:productId/:quantity
module.exports.update = async (req, res) => {
  // try {
    const orderId = req.params.id;
    const productId = req.params.productId;
    const quantity = parseInt(req.params.quantity);
    console.log(orderId);
    console.log(productId);
    console.log(quantity);
  //   await Order.updateOne({
  //     _id: orderId,
  //     'products.productId' : productId
  //   }, {
  //     $set: {
  //       'products.$.quantity' : quantity
  //     }
  //   });
  //   res.redirect("back");
  // } catch (error) {
  //   res.redirect("/cart");
  // }
}