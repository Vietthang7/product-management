const mongoose = require('mongoose');

const productList = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: Boolean,
});
const Product = mongoose.model('Product',productList ,"products");

module.exports = Product;