// controllers/loanController.js

const Loan = require('../models/Loan');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

// Get all loans
exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('customers')
      .populate('products');
    res.status(200).json({ success: true, data: loans });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a loan by ID
exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('customers')
      .populate('products');
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }
    res.status(200).json({ success: true, data: loan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new loan
// controllers/loanController.js

exports.createLoan = async (req, res) => {
  try {
    const { customers, products, description } = req.body;

    // Validate if customers and products exist
    const foundCustomers = await Customer.find({ _id: { $in: customers } });
    const foundProducts = await Product.find({ _id: { $in: products } });

    if (foundCustomers.length !== customers.length) {
      return res.status(400).json({ success: false, error: "Some customers do not exist." });
    }

    if (foundProducts.length !== products.length) {
      return res.status(400).json({ success: false, error: "Some products do not exist." });
    }

    // Create a new loan
    const newLoan = new Loan({
      customers,
      products,
      description,
    });

    await newLoan.save();

    // Update product availability
    await Product.updateMany(
      { _id: { $in: products } },
      { $set: { available: false } }
    );

    // Add the loan ID to each customer's loans array
    await Customer.updateMany(
      { _id: { $in: customers } },
      { $push: { loans: newLoan._id } }
    );

    res.status(201).json({ success: true, data: newLoan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a loan
exports.updateLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    // Update product availability if products are changed
    if (req.body.products) {
      // Set availability of old products to true
      await Product.updateMany(
        { _id: { $in: loan.products } },
        { $set: { available: true } }
      );

      // Set availability of new products to false
      await Product.updateMany(
        { _id: { $in: req.body.products } },
        { $set: { available: false } }
      );
    }

    const updatedLoan = await Loan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('customers')
      .populate('products');

    res.status(200).json({ success: true, data: updatedLoan });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a loan
exports.deleteLoan = async (req, res) => {
    try {
      const loan = await Loan.findById(req.params.id);
      if (!loan) {
        return res.status(404).json({ success: false, message: 'Loan not found' });
      }
  
      // Set availability of products back to true
      await Product.updateMany(
        { _id: { $in: loan.products } },
        { $set: { available: true } }
      );
  
      // Remove loan ID from customers' loans array
      await Customer.updateMany(
        { _id: { $in: loan.customers } },
        { $pull: { loans: loan._id } }
      );
  
      // Delete the loan
      await loan.deleteOne(); // Updated line
  
      res.status(200).json({ success: true, message: 'Loan deleted' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };