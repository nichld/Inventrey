// app.js

const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/dbConnect');
const customerRoutes = require('./routes/customerRoutes');
const loanRoutes = require('./routes/loanRoutes');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/products', productRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Inventory Management Backend is running.');
});

module.exports = app;