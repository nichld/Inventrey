const Account = require('../models/Account');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new account
// @route   POST /api/accounts/register
exports.registerAccount = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Check if username is already taken
    let account = await Account.findOne({ username });
    if (account) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new account
    const hashedPassword = await bcrypt.hash(password, 10);
    account = new Account({
      username,
      password: hashedPassword,
      role,
    });

    await account.save();
    res.status(201).json({ message: 'Account created successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Login account (returns JWT)
// @route   POST /api/accounts/login
exports.loginAccount = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if account exists
    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: account._id, role: account.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all accounts (admin only)
// @route   GET /api/accounts
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};