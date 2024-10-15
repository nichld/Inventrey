const ProductSchema = new Schema({
    name: { type: String, required: true }, // Specific product name (e.g., "Raspberry Pi 4 - Serial 12345")
    description: { type: String },
    category: { type: String, required: true }, // Grouping category (e.g., "Raspberry Pi")
    serialNumber: { type: String, unique: true, required: true }, // Unique identifier for the product (e.g., serial number)
    isAvailable: { type: Boolean, default: true }, // Whether the product is currently available
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Product', ProductSchema);