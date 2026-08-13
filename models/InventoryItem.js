const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String },
  unit: { type: String, default: 'kg' },
  quantity: { type: Number, default: 0 },
  warehouseId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryItem', inventorySchema);
