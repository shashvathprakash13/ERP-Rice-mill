const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  partyType: { type: String, enum: ['supplier','buyer','other'], required: true },
  partyId: { type: String, required: true },
  amount: { type: Number, required: true },
  mode: { type: String, enum: ['cash','bank','cheque','upi'], default: 'bank' },
  reference: { type: String },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
