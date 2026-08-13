const Warehouse = require('../models/Warehouse');
const mongoose = require('mongoose');
const dbIsUp = () => mongoose.connection.readyState === 1;

const mockWarehouses = [
  { warehouseId: 'warehouse-1', name: 'Warehouse 1 - Finished Goods', type: 'Warehouse', location: 'Plant 1', capacity: 50000, currentStock: 24000 }
];

exports.listWarehouses = async (req, res) => {
  try {
    if (!dbIsUp()) return res.json({ data: mockWarehouses, note: 'DB offline - returning mock data' });
    const list = await Warehouse.find();
    res.json({ data: list });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getWarehouse = async (req, res) => {
  try {
    if (!dbIsUp()) { const w = mockWarehouses.find(m=>m.warehouseId===req.params.id)||null; return res.json({ data: w }); }
    const w = await Warehouse.findOne({ warehouseId: req.params.id });
    if (!w) return res.status(404).json({ message: 'Warehouse not found' });
    res.json({ data: w });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createWarehouse = async (req, res) => {
  try {
    const { warehouseId, name, type, location, capacity } = req.body;
    if (!warehouseId || !name) return res.status(400).json({ message: 'warehouseId and name required' });
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot create warehouse in demo mode' });
    const exists = await Warehouse.findOne({ warehouseId });
    if (exists) return res.status(409).json({ message: 'warehouseId exists' });
    const w = new Warehouse({ warehouseId, name, type, location, capacity });
    await w.save();
    res.status(201).json({ message: 'Warehouse created', data: w });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateWarehouse = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot update warehouse in demo mode' });
    const updates = req.body;
    const w = await Warehouse.findOneAndUpdate({ warehouseId: req.params.id }, updates, { new: true, runValidators: true });
    if (!w) return res.status(404).json({ message: 'Warehouse not found' });
    res.json({ message: 'Warehouse updated', data: w });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteWarehouse = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot delete warehouse in demo mode' });
    const w = await Warehouse.findOneAndDelete({ warehouseId: req.params.id });
    if (!w) return res.status(404).json({ message: 'Warehouse not found' });
    res.json({ message: 'Warehouse deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
