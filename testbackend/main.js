// main.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Replace with your MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/inventreytest';

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Define Customer Schema
const customerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    unique: true,
    required: [true, 'Full name is required'],
  },
  loans: {
    type: Number,
    default: 0,
  },
});

// Create Customer Model
const Customer = mongoose.model('Customer', customerSchema);

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes

// Get all customers
app.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a new customer
app.post('/customers', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    // Handle duplicate fullName error
    if (error.code === 11000) {
      res.status(400).json({ success: false, error: 'Full name must be unique' });
    } else {
      res.status(400).json({ success: false, error: error.message });
    }
  }
});

// Update an existing customer
app.put('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    // Handle duplicate fullName error
    if (error.code === 11000) {
      res.status(400).json({ success: false, error: 'Full name must be unique' });
    } else {
      res.status(400).json({ success: false, error: error.message });
    }
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));