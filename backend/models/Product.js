// models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  productID: { type: String, required: true, unique: true },
  available: { type: Boolean, default: true },
});

module.exports = mongoose.model('Product', productSchema);