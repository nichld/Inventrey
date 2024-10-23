const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
router.get('/', getAllUsers);

// @route   GET /api/users/:id
// @desc    Get a single user by ID
router.get('/:id', getUserById);

// @route   POST /api/users
// @desc    Create a new user
router.post('/', createUser);

// @route   PUT /api/users/:id
// @desc    Update an existing user
router.put('/:id', updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete a user
router.delete('/:id', deleteUser);

module.exports = router;