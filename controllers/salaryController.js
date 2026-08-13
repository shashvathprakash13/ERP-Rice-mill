const SalaryRecord = require('../models/SalaryRecord');
const mongoose = require('mongoose');
const dbIsUp = () => mongoose.connection.readyState === 1;

const mockSalaries = [ { salaryId: 'SAL-2026-06-WRK-01', workerId: 'WRK-01', period: '2026-06', gross: 13500, deductions: 0, ot: 5, net: 13750, disbursed: true } ];

exports.list = async (req, res) => {
  try {
    if (!dbIsUp()) return res.json({ data: mockSalaries, note: 'DB offline - returning mock data' });
    const list = await SalaryRecord.find().sort({ createdAt: -1 });
    res.json({ data: list });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { salaryId, workerId, period, gross, deductions, ot, net } = req.body;
    if (!salaryId || !workerId || !period || gross === undefined || net === undefined) return res.status(400).json({ message: 'Missing required fields' });
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot create salary record in demo mode' });
    const exists = await SalaryRecord.findOne({ salaryId });
    if (exists) return res.status(409).json({ message: 'salaryId exists' });
    const s = new SalaryRecord({ salaryId, workerId, period, gross, deductions, ot, net });
    await s.save();
    res.status(201).json({ message: 'Salary record created', data: s });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.get = async (req, res) => {
  try {
    if (!dbIsUp()) { const s = mockSalaries.find(m => m.salaryId === req.params.id) || null; return res.json({ data: s }); }
    const s = await SalaryRecord.findOne({ salaryId: req.params.id });
    if (!s) return res.status(404).json({ message: 'Salary record not found' });
    res.json({ data: s });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
