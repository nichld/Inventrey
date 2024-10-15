const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('User', UserSchema);