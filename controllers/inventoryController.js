const InventoryItem = require('../models/InventoryItem');
const mongoose = require('mongoose');
const dbIsUp = () => mongoose.connection.readyState === 1;

const mockItems = [
  { sku: 'INV-001', name: 'Polished Rice 25kg', category: 'Finished', unit: 'kg', quantity: 5000, warehouseId: 'warehouse-1' }
];

exports.listItems = async (req, res) => {
  try {
    if (!dbIsUp()) return res.json({ data: mockItems, note: 'DB offline - returning mock data' });
    const items = await InventoryItem.find();
    res.json({ data: items });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getItem = async (req, res) => {
  try {
    if (!dbIsUp()) { const it = mockItems.find(m=>m.sku===req.params.id)||null; return res.json({ data: it }); }
    const it = await InventoryItem.findOne({ sku: req.params.id });
    if (!it) return res.status(404).json({ message: 'Item not found' });
    res.json({ data: it });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createItem = async (req, res) => {
  try {
    const { sku, name, category, unit, quantity, warehouseId } = req.body;
    if (!sku || !name) return res.status(400).json({ message: 'sku and name required' });
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot create item in demo mode' });
    const exists = await InventoryItem.findOne({ sku });
    if (exists) return res.status(409).json({ message: 'sku exists' });
    const item = new InventoryItem({ sku, name, category, unit, quantity, warehouseId });
    await item.save();
    res.status(201).json({ message: 'Item created', data: item });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateItem = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot update item in demo mode' });
    const updates = req.body;
    const it = await InventoryItem.findOneAndUpdate({ sku: req.params.id }, updates, { new: true, runValidators: true });
    if (!it) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item updated', data: it });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteItem = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot delete item in demo mode' });
    const it = await InventoryItem.findOneAndDelete({ sku: req.params.id });
    if (!it) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
