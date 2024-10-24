const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true, unique: true, },
});

// Create and export the Customer model
const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;