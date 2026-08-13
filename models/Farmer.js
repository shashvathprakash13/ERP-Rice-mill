const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  farmerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Farmer', 'Paik', 'Dealer'], default: 'Farmer' },
  contact: { type: String },
  address: { type: String },
  gstin: { type: String },
  createdAt: { type: Date, default: Date.now },
  notes: { type: String },
});

module.exports = mongoose.model('Farmer', farmerSchema);
