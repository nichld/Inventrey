const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Account', AccountSchema);