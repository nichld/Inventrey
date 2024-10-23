const express = require('express');
const {
  registerAccount,
  loginAccount,
  getAllAccounts,
} = require('../controllers/accountController');
const router = express.Router();

// @route   POST /api/accounts/register
// @desc    Register a new account
router.post('/register', registerAccount);

// @route   POST /api/accounts/login
// @desc    Login account (returns JWT)
router.post('/login', loginAccount);

// @route   GET /api/accounts
// @desc    Get all accounts (admin only)
router.get('/', getAllAccounts);

module.exports = router;