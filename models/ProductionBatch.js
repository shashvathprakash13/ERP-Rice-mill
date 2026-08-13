const mongoose = require('mongoose');

const productionBatchSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  variety: { type: String, required: true },
  startedAt: { type: Date },
  completedAt: { type: Date },
  status: { type: String, enum: ['Planned','Running','Milling','Drying','Completed','Halted'], default: 'Planned' },
  inputWeight: { type: Number },
  outputWeight: { type: Number },
  warehouse: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProductionBatch', productionBatchSchema);
