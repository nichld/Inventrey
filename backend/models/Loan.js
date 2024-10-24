// models/Loan.js

const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  description: { type: String, required: true }
});

module.exports = mongoose.model('Loan', loanSchema);