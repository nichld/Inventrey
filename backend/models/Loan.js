const LoanSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who borrowed the items
    products: [{ 
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the unique product
      serialNumber: { type: String, required: true }, // Store the product's serial number for easy tracking
    }],
    loanDate: { type: Date, default: Date.now },
    returnDate: { type: Date }, // Nullable, set when products are returned
    status: { type: String, default: 'ongoing', enum: ['ongoing', 'returned'] },
  });
  
  module.exports = mongoose.model('Loan', LoanSchema);