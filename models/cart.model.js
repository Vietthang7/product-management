const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [
      {
        productId : String,
        quantity : Number
      }
    ]
},{
    timestamps: true // Tự động thêm trường createdAt và updatedAt (https://mongoosejs.com/docs/timestamps.html)
});
const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;