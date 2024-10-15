const AccountSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Account', AccountSchema);