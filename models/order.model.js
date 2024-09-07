const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userInfo : {
    fullName : String,
    phone:String,
    address : String,
    notes : String
  },
  products : [
    {
      productId : String,
      price : Number,
      discountPercentage : Number,
      quantity : Number
    }
  ],
  totalPrice: {  
    type: Number,  
    default: 0 // giá trị mặc định là 0  
  },  
  status: String,
  payment : String,
  deleted: {
    type: Boolean,
    default: false
  },
  updatedBy: String,
  deletedBy:String,
},{
    timestamps: true // Tự động thêm trường createdAt và updatedAt (https://mongoosejs.com/docs/timestamps.html)
});
const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;