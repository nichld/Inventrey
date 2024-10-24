const Customer = require('../models/Customer');

// @desc Get all customers
// @route GET /api/customers
// @access Public
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a new customer
// @route POST /api/customers
// @access Public
const createCustomer = async (req, res) => {
  const { fullName } = req.body;

  if (!fullName) {
    return res.status(400).json({ message: 'Full name is required' });
  }

  try {
    const customerExists = await Customer.findOne({ fullName });

    if (customerExists) {
      return res.status(400).json({ message: 'Customer with this name already exists' });
    }

    const newCustomer = await Customer.create({ fullName });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update customer details
// @route PUT /api/customers/:id
// @access Public
const updateCustomer = async (req, res) => {
  const { fullName } = req.body;

  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.fullName = fullName || customer.fullName;
    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete customer
// @route DELETE /api/customers/:id
// @access Public
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.remove();
    res.json({ message: 'Customer removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};