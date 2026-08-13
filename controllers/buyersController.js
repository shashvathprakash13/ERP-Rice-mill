const Buyer = require('../models/Buyer');
const mongoose = require('mongoose');

const dbIsUp = () => mongoose.connection.readyState === 1;

const mockBuyers = [
  { buyerId: 'B-1001', name: 'Hindustan Rice Exports', address: 'Mumbai', creditLimit: 2000000, status: 'Active' },
  { buyerId: 'B-1002', name: 'Metro Supermarkets', address: 'Bengaluru', creditLimit: 500000, status: 'Near Limit' },
];

exports.listBuyers = async (req, res) => {
  try {
    if (!dbIsUp()) return res.json({ data: mockBuyers, note: 'DB offline - returning mock data' });
    const buyers = await Buyer.find();
    res.json({ data: buyers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBuyer = async (req, res) => {
  try {
    if (!dbIsUp()) {
      const b = mockBuyers.find(m => m.buyerId === req.params.id) || null;
      return res.json({ data: b, note: 'DB offline - returning mock data' });
    }
    const buyer = await Buyer.findOne({ buyerId: req.params.id });
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });
    res.json({ data: buyer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBuyer = async (req, res) => {
  try {
    const { buyerId, name, phone, address, creditLimit, status, notes } = req.body;
    if (!buyerId || !name) return res.status(400).json({ message: 'buyerId and name are required' });
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot create buyer in demo mode' });
    const existing = await Buyer.findOne({ buyerId });
    if (existing) return res.status(409).json({ message: 'buyerId already exists' });
    const newBuyer = new Buyer({ buyerId, name, phone, address, creditLimit, status, notes });
    await newBuyer.save();
    res.status(201).json({ message: 'Buyer created', data: newBuyer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBuyer = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot update buyer in demo mode' });
    const updates = req.body;
    const buyer = await Buyer.findOneAndUpdate({ buyerId: req.params.id }, updates, { new: true, runValidators: true });
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });
    res.json({ message: 'Buyer updated', data: buyer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBuyer = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot delete buyer in demo mode' });
    const buyer = await Buyer.findOneAndDelete({ buyerId: req.params.id });
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });
    res.json({ message: 'Buyer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
