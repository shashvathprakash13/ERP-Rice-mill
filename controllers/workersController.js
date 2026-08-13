const Worker = require('../models/Worker');
const mongoose = require('mongoose');
const dbIsUp = () => mongoose.connection.readyState === 1;

const mockWorkers = [ { workerId: 'WRK-01', name: 'Suresh Gowda', type: 'Daily-Waged', section: 'Sorting', wage: 450, mobile: '9876543210' } ];

exports.listWorkers = async (req, res) => {
  try {
    if (!dbIsUp()) return res.json({ data: mockWorkers, note: 'DB offline - returning mock data' });
    const list = await Worker.find();
    res.json({ data: list });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createWorker = async (req, res) => {
  try {
    const { workerId, name, type, section, wage, mobile } = req.body;
    if (!workerId || !name) return res.status(400).json({ message: 'workerId and name required' });
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot create worker in demo mode' });
    const exists = await Worker.findOne({ workerId });
    if (exists) return res.status(409).json({ message: 'workerId exists' });
    const w = new Worker({ workerId, name, type, section, wage, mobile });
    await w.save();
    res.status(201).json({ message: 'Worker created', data: w });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getWorker = async (req, res) => {
  try {
    if (!dbIsUp()) { const w = mockWorkers.find(m => m.workerId === req.params.id) || null; return res.json({ data: w }); }
    const w = await Worker.findOne({ workerId: req.params.id });
    if (!w) return res.status(404).json({ message: 'Worker not found' });
    res.json({ data: w });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateWorker = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot update worker in demo mode' });
    const updates = req.body;
    const w = await Worker.findOneAndUpdate({ workerId: req.params.id }, updates, { new: true, runValidators: true });
    if (!w) return res.status(404).json({ message: 'Worker not found' });
    res.json({ message: 'Worker updated', data: w });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteWorker = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot delete worker in demo mode' });
    const w = await Worker.findOneAndDelete({ workerId: req.params.id });
    if (!w) return res.status(404).json({ message: 'Worker not found' });
    res.json({ message: 'Worker deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
