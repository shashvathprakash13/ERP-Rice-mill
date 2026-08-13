const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  supplierId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Farmer', 'Dealer', 'Manufacturer', 'Other'], default: 'Dealer' },
  phone: { type: String },
  address: { type: String },
  gstin: { type: String },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  notes: { type: String },
});

module.exports = mongoose.model('Supplier', supplierSchema);
