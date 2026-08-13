const mongoose = require('mongoose');

const spareSchema = new mongoose.Schema({
  partId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String },
  stock: { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 0 },
  unit: { type: String, default: 'units' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SparePart', spareSchema);
