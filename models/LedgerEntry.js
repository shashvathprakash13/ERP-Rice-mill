const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  entryId: { type: String, required: true, unique: true },
  account: { type: String, required: true },
  type: { type: String, enum: ['debit','credit'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  reference: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LedgerEntry', ledgerSchema);
