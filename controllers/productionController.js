const ProductionBatch = require('../models/ProductionBatch');
const mongoose = require('mongoose');
const dbIsUp = () => mongoose.connection.readyState === 1;

const mockBatches = [
  { batchId: 'PB-1001', variety: 'Sona Masuri', status: 'Milling', inputWeight: 12000, outputWeight: 8000, warehouse: 'warehouse-1' }
];

exports.listBatches = async (req, res) => {
  try {
    if (!dbIsUp()) return res.json({ data: mockBatches, note: 'DB offline - returning mock data' });
    const batches = await ProductionBatch.find().sort({ createdAt: -1 });
    res.json({ data: batches });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getBatch = async (req, res) => {
  try {
    if (!dbIsUp()) { const b = mockBatches.find(m=>m.batchId===req.params.id)||null; return res.json({ data: b }); }
    const batch = await ProductionBatch.findOne({ batchId: req.params.id });
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    res.json({ data: batch });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createBatch = async (req, res) => {
  try {
    const { batchId, variety, inputWeight, warehouse, notes } = req.body;
    if (!batchId || !variety) return res.status(400).json({ message: 'batchId and variety required' });
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot create batch in demo mode' });
    const exists = await ProductionBatch.findOne({ batchId });
    if (exists) return res.status(409).json({ message: 'batchId exists' });
    const b = new ProductionBatch({ batchId, variety, inputWeight, warehouse, notes });
    await b.save();
    res.status(201).json({ message: 'Batch created', data: b });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateBatch = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot update batch in demo mode' });
    const updates = req.body;
    const batch = await ProductionBatch.findOneAndUpdate({ batchId: req.params.id }, updates, { new: true, runValidators: true });
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    res.json({ message: 'Batch updated', data: batch });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteBatch = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot delete batch in demo mode' });
    const batch = await ProductionBatch.findOneAndDelete({ batchId: req.params.id });
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    res.json({ message: 'Batch deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
