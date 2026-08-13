const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  shift: { type: String, default: 'Shift A' },
  records: { type: Object, default: {} }, // { workerId: { status: 'Present', ot: 2 } }
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
