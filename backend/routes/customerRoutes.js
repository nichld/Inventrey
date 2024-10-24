const express = require('express');
const router = express.Router();
const {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');

// Route to get all customers and create a new customer
router.route('/')
  .get(getCustomers) // GET /api/customers
  .post(createCustomer); // POST /api/customers

// Route to update and delete a customer by ID
router.route('/:id')
  .put(updateCustomer) // PUT /api/customers/:id
  .delete(deleteCustomer); // DELETE /api/customers/:id

module.exports = router;