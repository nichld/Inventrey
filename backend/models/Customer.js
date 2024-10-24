// models/Customer.js

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  fullName: { type: String, unique: true, required: true },
  loans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }],
});

module.exports = mongoose.model('Customer', customerSchema);