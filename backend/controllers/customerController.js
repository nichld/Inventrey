// controllers/customerController.js

const Customer = require('../models/Customer');
const Loan = require('../models/Loan');

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate('loans');
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('loans');
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get loans for a specific customer
// controllers/customerController.js

exports.getCustomerLoans = async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.id).populate({
        path: 'loans',
        populate: {
          path: 'products', // To populate products within each loan
        },
      });
  
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }
  
      res.status(200).json({ success: true, data: customer.loans });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json({ success: true, data: newCustomer });
  } catch (error) {
    // Handle duplicate fullName error
    if (error.code === 11000) {
      res.status(400).json({ success: false, error: 'Full name must be unique' });
    } else {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, data: updatedCustomer });
  } catch (error) {
    // Handle duplicate fullName error
    if (error.code === 11000) {
      res.status(400).json({ success: false, error: 'Full name must be unique' });
    } else {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, data: deletedCustomer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};