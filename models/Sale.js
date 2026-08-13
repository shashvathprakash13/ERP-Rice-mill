const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  saleId: { type: String, required: true, unique: true },
  buyerId: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  total: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending','Invoiced','Paid'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);
