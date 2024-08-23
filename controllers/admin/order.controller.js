const paginationHelper = require("../../helpers/pagination.helper");
const systemConfig = require("../../config/system");
const XLSX = require('xlsx');
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
    item.totalQuantity = 0;
    if (item.products.length > 0) {
      for (const product of item.products) {
        const priceNew = (1 - product.discountPercentage / 100) * product.price;
        item.totalQuantity += product.quantity;
        const totalPrice = priceNew * product.quantity;
        item.totalPrice += totalPrice;
      }
    }
    // Cập nhật totalPrice vào cơ sở dữ liệu  
    await Order.updateOne({ _id: item._id }, { totalPrice: item.totalPrice });
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
    order.totalPrice = 0;
    if (order.products.length > 0) {
      for (const product of order.products) {
        const productInfo = await Product.findOne({
          _id: product.productId
        }).select("title thumbnail slug price discountPercentage");
        productInfo.priceNew = (1 - productInfo.discountPercentage / 100) * productInfo.price;
        product.productInfo = productInfo;
        product.totalPrice = productInfo.priceNew * product.quantity;
        order.totalPrice += product.totalPrice;
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
// [PATCH] /admin/orders/edit/:id
module.exports.editPatch = async (req, res) => {
  if (res.locals.role.permissions.includes("orders_edit")) {
    try {
      const id = req.params.id;
      const order = await Order.findOne({
        _id: id,
        deleted: false
      });
      order.userInfo.fullName = req.body.fullName || order.userInfo.fullName;
      order.userInfo.phone = req.body.phone || order.userInfo.phone;
      order.userInfo.address = req.body.address || order.userInfo.address;
      order.userInfo.notes = req.body.notes || order.userInfo.notes;
      // Đảm bảo rằng productIds và quantities luôn là mảng  
      let productIds;
      if (Array.isArray(req.body['productId[]'])) {
        // Nếu 'productId[]' là một mảng  
        productIds = req.body['productId[]'];
      } else {
        // Nếu không, gán giá trị thành một mảng với một phần tử  
        productIds = [req.body['productId[]']];
      }

      let quantities;
      if (Array.isArray(req.body.quantity)) {
        // Nếu 'quantity' là một mảng  
        quantities = req.body.quantity;
      } else {
        // Nếu không, gán giá trị thành một mảng với một phần tử  
        quantities = [req.body.quantity];
      }
      order.updatedBy = res.locals.account.id;
      productIds.forEach((productId, index) => {
        const quantity = Number(quantities[index]); // Chuyển đổi số lượng thành số  
        // Tìm sản phẩm trong mảng và cập nhật số lượng  
        const product = order.products.find((prod) => prod.productId.toString() === productId);
        if (product) {
          product.quantity = quantity; // Cập nhật số lượng  
        }
      })
      await order.save();
      req.flash("success", "Cập nhật sản phẩm thành công!");

    } catch (error) {
      req.flash("error", "Id sản phẩm không hợp lệ !");
    }
    res.redirect("back");
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findOne({
      _id: id,
      deleted: false
    });
    order.totalPrice = 0;
    if (order.products.length > 0) {
      for (const product of order.products) {
        const productInfo = await Product.findOne({
          _id: product.productId
        }).select("title thumbnail slug price discountPercentage");
        productInfo.priceNew = (1 - productInfo.discountPercentage / 100) * productInfo.price;
        product.productInfo = productInfo;
        product.totalPrice = productInfo.priceNew * product.quantity;
        order.totalPrice += product.totalPrice;
      }
      if (order) {
        res.render("admin/pages/orders/detail", {
          pageTitle: "Chi tiết đơn hàng",
          order: order,
        });
      }
    }
    else {
      res.redirect(`${systemConfig.prefixAdmin}/orders`);
    }
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/orders`);
  }
}
//[PATCH]/admin/orders/delete/:id
module.exports.deleteItem = async (req, res) => {
  if (res.locals.role.permissions.includes("orders_delete")) {
    try {
      const id = req.params.id;
      //Tìm đơn hàng để lấy thông tin sản phẩm
      const order = await Order.findOne({
        _id: id
      });
      // Lặp qua từng sản phẩm trong đơn hàng để cập nhật số lượng sản phẩm
      for (const item of order.products) {
        const productId = item.productId;
        const addQuantity = item.quantity;
        // Cập nhật số lượng sản phẩm trong bản ghi Product
        await Product.updateOne(
          {
            _id: productId,
          }, {
          $inc: { stock: addQuantity }
        }
        );
      }
      await Order.deleteOne({
        _id: id
      });
      req.flash('success', 'Đã xóa đơn hàng!');
      res.json({
        code: 200
      })
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/orders`);
    }
  } else {
    res.send(`403`);
  }
}
//[POST]/admin/orders/export-excel
module.exports.exportExcel = async (req, res) => {
  try {
    const orderIds = req.body;
    const orders = await Order.find({
      _id: { $in: orderIds },
    })
    // Trích xuất ID sản phẩm 
    const productIds = orders.flatMap(order =>   
      order.products.map(product => product.productId)  
    );  

    // Lấy ID sản phẩm duy nhất:  
    const uniqueProductIds = [...new Set(productIds)];  
    // Lấy thông tin sản phẩm:  
    const products = await Product.find({  
      _id: { $in: uniqueProductIds },  
    });  

    // Tạo bản đồ để dễ dàng truy cập vào tiêu đề sản phẩm  
    const productMap = products.reduce((maproduct, product) => {  
      maproduct[product._id] = product.title;  
      return maproduct;  
    }, {});
    const data = orders.map(order => ({  
      "Người nhận": order.userInfo.fullName,  
      "Số điện thoại": order.userInfo.phone,  
      "Địa chỉ": order.userInfo.address,  
      products: order.products.map(product => (  
        `${productMap[product.productId] || 'Unknown Product'} (Quantity: ${product.quantity})`  
      )).join('; '),  
      "Tổng tiền": order.totalPrice  
    })); 
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

    res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    req.flash('success', 'Xuất đơn hàng thành công!');
    res.send(excelBuffer);
  } catch (error) {
    console.error('Lỗi khi xuất Excel:', error);
    req.flash('error', 'Đã xảy ra lỗi!');
  }
}
