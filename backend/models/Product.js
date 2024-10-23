const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    serialNumber: { type: String, unique: true, required: true },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Product', ProductSchema);