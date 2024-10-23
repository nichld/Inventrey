const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Use the error handler middleware after all routes

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Import routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
const accountRoutes = require('./routes/accountRoutes');

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/accounts', accountRoutes);

// Set up server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));