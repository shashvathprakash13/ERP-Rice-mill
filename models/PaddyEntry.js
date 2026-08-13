const mongoose = require('mongoose');

const paddyEntrySchema = new mongoose.Schema({
  entryId: { type: String, required: true, unique: true },
  vehicleNo: { type: String, required: true },
  supplierId: { type: String, required: true },
  variety: { type: String, required: true },
  grossWeight: { type: Number, required: true },
  tareWeight: { type: Number, required: true },
  netWeight: { type: Number, required: true },
  moisture: { type: Number },
  silo: { type: String },
  status: { type: String, enum: ['Pending', 'Weighed', 'Stored', 'Rejected'], default: 'Pending' },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  notes: { type: String },
});

module.exports = mongoose.model('PaddyEntry', paddyEntrySchema);
