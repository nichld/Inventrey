// routes/loanRoutes.js

const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Get all loans
router.get('/', loanController.getLoans);

// Get a loan by ID
router.get('/:id', loanController.getLoanById);

// Create a new loan
router.post('/', loanController.createLoan);

// Update a loan
router.put('/:id', loanController.updateLoan);

// Delete a loan
router.delete('/:id', loanController.deleteLoan);

module.exports = router;