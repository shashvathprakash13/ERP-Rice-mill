const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  buyerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  creditLimit: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Near Limit', 'Blocked'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  notes: { type: String },
});

module.exports = mongoose.model('Buyer', buyerSchema);
