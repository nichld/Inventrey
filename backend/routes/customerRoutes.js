// routes/customerRoutes.js

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Get all customers
router.get('/', customerController.getCustomers);

// Get a customer by ID
router.get('/:id', customerController.getCustomerById);

// Get loans for a specific customer
router.get('/:id/loans', customerController.getCustomerLoans);

// Create a new customer
router.post('/', customerController.createCustomer);

// Update a customer
router.put('/:id', customerController.updateCustomer);

// Delete a customer
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;