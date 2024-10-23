const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoanSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ 
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      serialNumber: { type: String, required: true },
    }],
    loanDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
    status: { type: String, default: 'ongoing', enum: ['ongoing', 'returned'] },
  });
  
  module.exports = mongoose.model('Loan', LoanSchema);