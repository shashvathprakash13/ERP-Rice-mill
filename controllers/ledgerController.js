const LedgerEntry = require('../models/LedgerEntry');
const mongoose = require('mongoose');
const dbIsUp = () => mongoose.connection.readyState === 1;

const mockEntries = [ { entryId: 'L-1001', account: 'Cash', type: 'debit', amount: 100000, reference: 'Opening', notes: 'Opening balance' } ];

exports.listEntries = async (req, res) => {
  try {
    if (!dbIsUp()) return res.json({ data: mockEntries, note: 'DB offline - returning mock data' });
    const list = await LedgerEntry.find().sort({ date: -1 });
    res.json({ data: list });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createEntry = async (req, res) => {
  try {
    const { entryId, account, type, amount, reference, notes } = req.body;
    if (!entryId || !account || !type || amount === undefined) return res.status(400).json({ message: 'Missing required fields' });
    if (!['debit','credit'].includes(type)) return res.status(400).json({ message: 'type must be debit or credit' });
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot create entry in demo mode' });
    const exists = await LedgerEntry.findOne({ entryId });
    if (exists) return res.status(409).json({ message: 'entryId exists' });
    const e = new LedgerEntry({ entryId, account, type, amount, reference, notes });
    await e.save();
    res.status(201).json({ message: 'Ledger entry created', data: e });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getEntry = async (req, res) => {
  try {
    if (!dbIsUp()) { const e = mockEntries.find(m => m.entryId === req.params.id) || null; return res.json({ data: e }); }
    const e = await LedgerEntry.findOne({ entryId: req.params.id });
    if (!e) return res.status(404).json({ message: 'Entry not found' });
    res.json({ data: e });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteEntry = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot delete entry in demo mode' });
    const e = await LedgerEntry.findOneAndDelete({ entryId: req.params.id });
    if (!e) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Ledger entry deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
