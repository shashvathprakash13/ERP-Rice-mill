const PaddyEntry = require('../models/PaddyEntry');
const mongoose = require('mongoose');

const dbIsUp = () => mongoose.connection.readyState === 1;

const mockEntries = [
  { entryId: 'PE-1001', vehicleNo: 'KA-34-F-8920', supplierId: 'F-1001', variety: 'Sona Masuri', grossWeight: 12500, tareWeight: 500, netWeight: 12000, moisture: 12.5, silo: 'silo-1', status: 'Weighed', date: new Date().toISOString() },
];

exports.listEntries = async (req, res) => {
  try {
    if (!dbIsUp()) return res.json({ data: mockEntries, note: 'DB offline - returning mock data' });
    const entries = await PaddyEntry.find().sort({ date: -1 });
    res.json({ data: entries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEntry = async (req, res) => {
  try {
    if (!dbIsUp()) {
      const e = mockEntries.find(m => m.entryId === req.params.id) || null;
      return res.json({ data: e, note: 'DB offline - returning mock data' });
    }
    const entry = await PaddyEntry.findOne({ entryId: req.params.id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ data: entry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEntry = async (req, res) => {
  try {
    const { entryId, vehicleNo, supplierId, variety, grossWeight, tareWeight, moisture, silo, notes } = req.body;
    if (!entryId || !vehicleNo || !supplierId || !variety || !grossWeight || tareWeight === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const netWeight = Number(grossWeight) - Number(tareWeight);
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot create entry in demo mode' });
    const existing = await PaddyEntry.findOne({ entryId });
    if (existing) return res.status(409).json({ message: 'entryId already exists' });
    const newEntry = new PaddyEntry({ entryId, vehicleNo, supplierId, variety, grossWeight, tareWeight, netWeight, moisture, silo, notes });
    await newEntry.save();
    res.status(201).json({ message: 'Paddy entry recorded', data: newEntry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEntry = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot update entry in demo mode' });
    const updates = req.body;
    if (updates.grossWeight !== undefined || updates.tareWeight !== undefined) {
      // Recalculate netWeight if weights changed
      const current = await PaddyEntry.findOne({ entryId: req.params.id });
      const gross = updates.grossWeight !== undefined ? Number(updates.grossWeight) : (current ? current.grossWeight : 0);
      const tare = updates.tareWeight !== undefined ? Number(updates.tareWeight) : (current ? current.tareWeight : 0);
      updates.netWeight = gross - tare;
    }
    const entry = await PaddyEntry.findOneAndUpdate({ entryId: req.params.id }, updates, { new: true, runValidators: true });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry updated', data: entry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEntry = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot delete entry in demo mode' });
    const entry = await PaddyEntry.findOneAndDelete({ entryId: req.params.id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
