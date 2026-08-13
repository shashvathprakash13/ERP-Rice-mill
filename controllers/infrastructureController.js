const SparePart = require('../models/SparePart');
const mongoose = require('mongoose');
const dbIsUp = () => mongoose.connection.readyState === 1;

const mockSpares = [ { partId: 'SP-101', name: 'Rubber Rollers 10"', category: 'Milling Line', stock: 4, reorderLevel: 6, unit: 'units' } ];

exports.listSpares = async (req, res) => {
  try {
    if (!dbIsUp()) return res.json({ data: mockSpares, note: 'DB offline - returning mock data' });
    const list = await SparePart.find();
    res.json({ data: list });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createSpare = async (req, res) => {
  try {
    const { partId, name, category, stock, reorderLevel, unit } = req.body;
    if (!partId || !name) return res.status(400).json({ message: 'partId and name required' });
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot create spare in demo mode' });
    const exists = await SparePart.findOne({ partId });
    if (exists) return res.status(409).json({ message: 'partId exists' });
    const p = new SparePart({ partId, name, category, stock, reorderLevel, unit });
    await p.save();
    res.status(201).json({ message: 'Spare part created', data: p });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getSpare = async (req, res) => {
  try {
    if (!dbIsUp()) { const s = mockSpares.find(m => m.partId === req.params.id) || null; return res.json({ data: s }); }
    const s = await SparePart.findOne({ partId: req.params.id });
    if (!s) return res.status(404).json({ message: 'Spare not found' });
    res.json({ data: s });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateSpare = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot update spare in demo mode' });
    const updates = req.body;
    const s = await SparePart.findOneAndUpdate({ partId: req.params.id }, updates, { new: true, runValidators: true });
    if (!s) return res.status(404).json({ message: 'Spare not found' });
    res.json({ message: 'Spare updated', data: s });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteSpare = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot delete spare in demo mode' });
    const s = await SparePart.findOneAndDelete({ partId: req.params.id });
    if (!s) return res.status(404).json({ message: 'Spare not found' });
    res.json({ message: 'Spare deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
