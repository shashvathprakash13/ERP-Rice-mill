const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  warehouseId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Warehouse','Silo','Godown'], default: 'Warehouse' },
  location: { type: String },
  capacity: { type: Number },
  currentStock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Warehouse', warehouseSchema);
