const Supplier = require('../models/Supplier');
const mongoose = require('mongoose');

const dbIsUp = () => mongoose.connection.readyState === 1;

const mockSuppliers = [
  { supplierId: 'SUP-1001', name: 'Sri Balaji Traders', type: 'Dealer', phone: '9845123456', address: 'Hubli', gstin: '', balance: 1748500 },
  { supplierId: 'SUP-1002', name: 'Ramesh Kumar', type: 'Farmer', phone: '9876543210', address: 'Mandya', gstin: '', balance: 0 },
];

// GET /api/suppliers
exports.listSuppliers = async (req, res) => {
  try {
    if (!dbIsUp()) return res.json({ data: mockSuppliers, note: 'DB offline - returning mock data' });
    const suppliers = await Supplier.find();
    res.json({ data: suppliers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/suppliers/:id
exports.getSupplier = async (req, res) => {
  try {
    if (!dbIsUp()) {
      const s = mockSuppliers.find(m => m.supplierId === req.params.id) || null;
      return res.json({ data: s, note: 'DB offline - returning mock data' });
    }
    const supplier = await Supplier.findOne({ supplierId: req.params.id });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ data: supplier });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/suppliers
exports.createSupplier = async (req, res) => {
  try {
    const { supplierId, name, type, phone, address, gstin, balance, notes } = req.body;
    if (!supplierId || !name) return res.status(400).json({ message: 'supplierId and name are required' });
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot create supplier in demo mode' });
    const existing = await Supplier.findOne({ supplierId });
    if (existing) return res.status(409).json({ message: 'supplierId already exists' });
    const newSupplier = new Supplier({ supplierId, name, type, phone, address, gstin, balance, notes });
    await newSupplier.save();
    res.status(201).json({ message: 'Supplier created', data: newSupplier });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/suppliers/:id
exports.updateSupplier = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot update supplier in demo mode' });
    const updates = req.body;
    const supplier = await Supplier.findOneAndUpdate({ supplierId: req.params.id }, updates, { new: true, runValidators: true });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ message: 'Supplier updated', data: supplier });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/suppliers/:id
exports.deleteSupplier = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot delete supplier in demo mode' });
    const supplier = await Supplier.findOneAndDelete({ supplierId: req.params.id });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ message: 'Supplier deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
