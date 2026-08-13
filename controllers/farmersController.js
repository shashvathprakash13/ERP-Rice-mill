const Farmer = require('../models/Farmer');
const mongoose = require('mongoose');

const dbIsUp = () => mongoose.connection.readyState === 1;

const mockFarmers = [
  { farmerId: 'F-1001', name: 'Ramesh Kumar', type: 'Farmer', contact: '9876543210', address: 'Mandya, Karnataka' },
  { farmerId: 'F-1002', name: 'Siva Prasad', type: 'Paik', contact: '8765432109', address: 'Kurnool, AP' },
];

// GET /api/farmers
exports.listFarmers = async (req, res) => {
  try {
    if (!dbIsUp()) return res.json({ data: mockFarmers, note: 'DB offline - returning mock data' });
    const farmers = await Farmer.find();
    res.json({ data: farmers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/farmers/:id
exports.getFarmer = async (req, res) => {
  try {
    if (!dbIsUp()) {
      const f = mockFarmers.find(m => m.farmerId === req.params.id) || null;
      return res.json({ data: f, note: 'DB offline - returning mock data' });
    }
    const farmer = await Farmer.findOne({ farmerId: req.params.id });
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    res.json({ data: farmer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/farmers
exports.createFarmer = async (req, res) => {
  try {
    const { farmerId, name, type, contact, address, gstin, notes } = req.body;
    if (!farmerId || !name) return res.status(400).json({ message: 'farmerId and name are required' });
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot create farmer in demo mode' });
    const existing = await Farmer.findOne({ farmerId });
    if (existing) return res.status(409).json({ message: 'farmerId already exists' });
    const newFarmer = new Farmer({ farmerId, name, type, contact, address, gstin, notes });
    await newFarmer.save();
    res.status(201).json({ message: 'Farmer created', data: newFarmer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/farmers/:id
exports.updateFarmer = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot update farmer in demo mode' });
    const updates = req.body;
    const farmer = await Farmer.findOneAndUpdate({ farmerId: req.params.id }, updates, { new: true, runValidators: true });
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    res.json({ message: 'Farmer updated', data: farmer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/farmers/:id
exports.deleteFarmer = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot delete farmer in demo mode' });
    const farmer = await Farmer.findOneAndDelete({ farmerId: req.params.id });
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    res.json({ message: 'Farmer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
