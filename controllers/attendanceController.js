const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');
const dbIsUp = () => mongoose.connection.readyState === 1;

const mockAttendance = [ { date: '2026-06-15', shift: 'Shift A', records: { 'WRK-01': { status: 'Present', ot: 2 } } } ];

exports.list = async (req, res) => {
  try {
    if (!dbIsUp()) return res.json({ data: mockAttendance, note: 'DB offline - returning mock data' });
    const list = await Attendance.find().sort({ date: -1 });
    res.json({ data: list });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { date, shift, records } = req.body;
    if (!date || !records) return res.status(400).json({ message: 'date and records required' });
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot create attendance in demo mode' });
    const a = new Attendance({ date, shift, records });
    await a.save();
    res.status(201).json({ message: 'Attendance saved', data: a });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getByDate = async (req, res) => {
  try {
    if (!dbIsUp()) { const a = mockAttendance.find(m=>m.date===req.params.date)||null; return res.json({ data: a }); }
    const a = await Attendance.findOne({ date: req.params.date });
    if (!a) return res.status(404).json({ message: 'Attendance not found' });
    res.json({ data: a });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
