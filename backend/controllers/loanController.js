const Loan = require('../models/Loan');
const Product = require('../models/Product');

// @desc    Get all loans
// @route   GET /api/loans
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate('user products.product');
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get a loan by ID
// @route   GET /api/loans/:id
exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate('user products.product');
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new loan
// @route   POST /api/loans
exports.createLoan = async (req, res) => {
  const { user, products } = req.body;

  try {
    // Create loan
    const loan = new Loan({
      user,
      products,
    });

    // Mark products as unavailable
    for (let i = 0; i < products.length; i++) {
      const product = await Product.findById(products[i].product);
      if (!product || !product.isAvailable) {
        return res.status(400).json({ message: 'Product not available for loan' });
      }
      product.isAvailable = false;
      await product.save();
    }

    await loan.save();
    res.status(201).json(loan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update loan status
// @route   PUT /api/loans/:id/status
exports.updateLoanStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const loan = await Loan.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    res.json(loan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Return a loan (mark items as returned)
// @route   PUT /api/loans/:id/return
exports.returnLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Mark products as available again
    for (let i = 0; i < loan.products.length; i++) {
      const product = await Product.findById(loan.products[i].product);
      product.isAvailable = true;
      await product.save();
    }

    loan.returnDate = new Date();
    loan.status = 'returned';
    await loan.save();
    res.json(loan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};