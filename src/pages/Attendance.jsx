import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, ClipboardCheck, AlertCircle, Save, CheckCircle2 } from 'lucide-react';

export default function Attendance() {
  const { workers, saveAttendance, attendanceHistory } = useApp();
  const [selectedDate, setSelectedDate] = useState('2026-06-16');
  const [selectedShift, setSelectedShift] = useState('Shift A');
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize/load attendance records when date or shift changes
  useEffect(() => {
    // Check if there's an existing record in history for this date & shift
    const existing = attendanceHistory.find(
      (h) => h.date === selectedDate && h.shift === selectedShift
    );

    const initialRecords = {};
    workers.forEach((worker) => {
      if (existing && existing.records[worker.id]) {
        initialRecords[worker.id] = {
          status: existing.records[worker.id].status,
          ot: existing.records[worker.id].ot,
        };
      } else {
        // Defaults
        initialRecords[worker.id] = {
          status: 'Present',
          ot: 0,
        };
      }
    });

    setAttendanceRecords(initialRecords);
  }, [selectedDate, selectedShift, workers, attendanceHistory]);

  const handleStatusChange = (workerId, status) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [workerId]: {
        ...prev[workerId],
        status,
      },
    }));
  };

  const handleOtChange = (workerId, otHours) => {
    const hours = Math.max(0, Math.min(16, parseFloat(otHours) || 0));
    setAttendanceRecords((prev) => ({
      ...prev,
      [workerId]: {
        ...prev[workerId],
        ot: hours,
      },
    }));
  };

  const handleSave = () => {
    saveAttendance(selectedDate, selectedShift, attendanceRecords);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Shift Attendance Worksheet</h2>
          <p className="text-xs text-slate-500 mt-0.5">Log biometric entries, verify check-ins, record half-days, and audit overtime logs.</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-3.5 rounded text-xs flex items-center space-x-2.5">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span className="font-semibold">Shift roster saved! Payroll records and overtime rates have been updated.</span>
        </div>
      )}

      {/* Date & Shift Selectors */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px] flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-slate-450" /> Roster Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-slate-800 cursor-pointer"
            />
          </div>

          {/* Shift Picker */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px] flex items-center">
              <Clock className="h-3 w-3 mr-1 text-slate-450" /> Operating Shift
            </label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-slate-800 cursor-pointer"
            >
              <option value="Shift A">Shift A (06:00 AM - 02:00 PM)</option>
              <option value="Shift B">Shift B (02:00 PM - 10:00 PM)</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded transition-colors shadow-xs cursor-pointer w-full sm:w-auto justify-center"
        >
          <Save className="h-4 w-4" />
          <span>Save Attendance Roster</span>
        </button>
      </div>

      {/* Roster Spreadsheet */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden flex flex-col">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ClipboardCheck className="h-4 w-4 text-slate-500" />
            <h3 className="font-extrabold text-sm text-slate-900">Roster Worksheet</h3>
          </div>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
            {workers.length} Workers Configured
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-3">Worker ID</th>
                <th className="px-6 py-3">Worker Name</th>
                <th className="px-6 py-3">Assigned Section</th>
                <th className="px-6 py-3">Daily Wage Rate</th>
                <th className="px-6 py-3 text-center">Attendance Status Toggle</th>
                <th className="px-6 py-3 text-center">OT Hours</th>
                <th className="px-6 py-3 text-right">Roster Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workers.map((worker) => {
                const record = attendanceRecords[worker.id] || { status: 'Present', ot: 0 };
                return (
                  <tr key={worker.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* ID */}
                    <td className="px-6 py-3.5 text-slate-500 font-mono font-semibold">{worker.id}</td>
                    
                    {/* Name */}
                    <td className="px-6 py-3.5 text-slate-950 font-bold">{worker.name}</td>
                    
                    {/* Section */}
                    <td className="px-6 py-3.5 text-slate-600 font-medium">{worker.section}</td>
                    
                    {/* Wage */}
                    <td className="px-6 py-3.5 text-slate-800 font-bold">₹{worker.wage} / day</td>
                    
                    {/* Status Toggles */}
                    <td className="px-6 py-3.5">
                      <div className="flex justify-center items-center">
                        <div className="inline-flex bg-slate-100 p-0.5 rounded border border-slate-200/50">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(worker.id, 'Present')}
                            className={`px-3 py-1 font-bold rounded text-[10px] uppercase transition-all cursor-pointer ${
                              record.status === 'Present'
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(worker.id, 'Half-Day')}
                            className={`px-3 py-1 font-bold rounded text-[10px] uppercase transition-all cursor-pointer ${
                              record.status === 'Half-Day'
                                ? 'bg-amber-500 text-slate-955 shadow-xs'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            Half-Day
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(worker.id, 'Absent')}
                            className={`px-3 py-1 font-bold rounded text-[10px] uppercase transition-all cursor-pointer ${
                              record.status === 'Absent'
                                ? 'bg-rose-500 text-white shadow-xs'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* OT Hours */}
                    <td className="px-6 py-3.5">
                      <div className="flex justify-center items-center">
                        <input
                          type="number"
                          min="0"
                          max="16"
                          step="0.5"
                          disabled={record.status === 'Absent'}
                          value={record.status === 'Absent' ? 0 : record.ot}
                          onChange={(e) => handleOtChange(worker.id, e.target.value)}
                          className="w-16 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 text-center font-mono font-bold text-slate-700 disabled:opacity-40"
                        />
                        <span className="text-[10px] text-slate-400 ml-1.5 font-semibold">hrs</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-3.5 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                        record.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : record.status === 'Half-Day'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {record.status}
                        {record.status !== 'Absent' && record.ot > 0 ? ` + ${record.ot}h OT` : ''}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info panel */}
        <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-450 font-medium">
            <AlertCircle className="h-4 w-4" />
            <span>Attendance changes saved here directly compile days-worked for payroll disbursements.</span>
          </div>
          <div className="font-bold text-slate-600">
            Current roster: {Object.values(attendanceRecords).filter((r) => r.status === 'Present').length} Present |{' '}
            {Object.values(attendanceRecords).filter((r) => r.status === 'Half-Day').length} Half-Day |{' '}
            {Object.values(attendanceRecords).filter((r) => r.status === 'Absent').length} Absent
          </div>
        </div>
      </div>
    </div>
  );
}
