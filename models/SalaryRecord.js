const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  salaryId: { type: String, required: true, unique: true },
  workerId: { type: String, required: true },
  period: { type: String, required: true }, // YYYY-MM
  gross: { type: Number, required: true },
  deductions: { type: Number, default: 0 },
  ot: { type: Number, default: 0 },
  net: { type: Number, required: true },
  disbursed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SalaryRecord', salarySchema);
