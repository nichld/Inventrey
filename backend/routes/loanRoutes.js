const express = require('express');
const {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoanStatus,
  returnLoan,
} = require('../controllers/loanController');
const router = express.Router();

// @route   GET /api/loans
// @desc    Get all loans
router.get('/', getAllLoans);

// @route   GET /api/loans/:id
// @desc    Get a single loan by ID
router.get('/:id', getLoanById);

// @route   POST /api/loans
// @desc    Create a new loan
router.post('/', createLoan);

// @route   PUT /api/loans/:id/status
// @desc    Update the loan status (e.g., returned)
router.put('/:id/status', updateLoanStatus);

// @route   PUT /api/loans/:id/return
// @desc    Mark the loan as returned (return the items)
router.put('/:id/return', returnLoan);

module.exports = router;