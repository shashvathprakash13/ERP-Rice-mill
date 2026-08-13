const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  workerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Daily-Waged','Seasonal','Permanent'], default: 'Daily-Waged' },
  section: { type: String },
  wage: { type: Number },
  mobile: { type: String },
  status: { type: String, enum: ['Active','Inactive'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Worker', workerSchema);
