const Sale = require('../models/Sale');
const mongoose = require('mongoose');
const dbIsUp = () => mongoose.connection.readyState === 1;

const mockSales = [
  { saleId: 'S-1001', buyerId: 'B-1001', sku: 'INV-001', quantity: 1000, rate: 45, total: 45000, status: 'Invoiced' }
];

exports.listSales = async (req, res) => {
  try {
    if (!dbIsUp()) return res.json({ data: mockSales, note: 'DB offline - returning mock data' });
    const list = await Sale.find().sort({ saleDate: -1 });
    res.json({ data: list });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getSale = async (req, res) => {
  try {
    if (!dbIsUp()) { const s = mockSales.find(m=>m.saleId===req.params.id)||null; return res.json({ data: s }); }
    const s = await Sale.findOne({ saleId: req.params.id });
    if (!s) return res.status(404).json({ message: 'Sale not found' });
    res.json({ data: s });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createSale = async (req, res) => {
  try {
    const { saleId, buyerId, sku, quantity, rate } = req.body;
    if (!saleId || !buyerId || !sku || !quantity || !rate) return res.status(400).json({ message: 'Missing required fields' });
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot create sale in demo mode' });
    const exists = await Sale.findOne({ saleId });
    if (exists) return res.status(409).json({ message: 'saleId exists' });
    const total = Number(quantity) * Number(rate);
    const s = new Sale({ saleId, buyerId, sku, quantity, rate, total });
    await s.save();
    res.status(201).json({ message: 'Sale recorded', data: s });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateSale = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot update sale in demo mode' });
    const updates = req.body;
    if (updates.quantity !== undefined || updates.rate !== undefined) {
      const current = await Sale.findOne({ saleId: req.params.id });
      const q = updates.quantity !== undefined ? Number(updates.quantity) : (current?current.quantity:0);
      const r = updates.rate !== undefined ? Number(updates.rate) : (current?current.rate:0);
      updates.total = q * r;
    }
    const s = await Sale.findOneAndUpdate({ saleId: req.params.id }, updates, { new: true, runValidators: true });
    if (!s) return res.status(404).json({ message: 'Sale not found' });
    res.json({ message: 'Sale updated', data: s });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteSale = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot delete sale in demo mode' });
    const s = await Sale.findOneAndDelete({ saleId: req.params.id });
    if (!s) return res.status(404).json({ message: 'Sale not found' });
    res.json({ message: 'Sale deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
