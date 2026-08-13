const Payment = require('../models/Payment');
const mongoose = require('mongoose');
const dbIsUp = () => mongoose.connection.readyState === 1;

const mockPayments = [ { paymentId: 'P-1001', partyType: 'supplier', partyId: 'SUP-1001', amount: 50000, mode: 'bank', reference: 'INV-1001' } ];

exports.listPayments = async (req, res) => {
  try {
    if (!dbIsUp()) return res.json({ data: mockPayments, note: 'DB offline - returning mock data' });
    const list = await Payment.find().sort({ date: -1 });
    res.json({ data: list });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createPayment = async (req, res) => {
  try {
    const { paymentId, partyType, partyId, amount, mode, reference } = req.body;
    if (!paymentId || !partyType || !partyId || amount === undefined) return res.status(400).json({ message: 'Missing required fields' });
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot create payment in demo mode' });
    const exists = await Payment.findOne({ paymentId });
    if (exists) return res.status(409).json({ message: 'paymentId exists' });
    const p = new Payment({ paymentId, partyType, partyId, amount, mode, reference });
    await p.save();
    res.status(201).json({ message: 'Payment recorded', data: p });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getPayment = async (req, res) => {
  try {
    if (!dbIsUp()) {
      const p = mockPayments.find(m => m.paymentId === req.params.id) || null;
      return res.json({ data: p });
    }
    const p = await Payment.findOne({ paymentId: req.params.id });
    if (!p) return res.status(404).json({ message: 'Payment not found' });
    res.json({ data: p });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deletePayment = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot delete payment in demo mode' });
    const p = await Payment.findOneAndDelete({ paymentId: req.params.id });
    if (!p) return res.status(404).json({ message: 'Payment not found' });
    res.json({ message: 'Payment deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
