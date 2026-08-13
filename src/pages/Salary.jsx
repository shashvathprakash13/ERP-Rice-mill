import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DollarSign, FileSpreadsheet, Check, Send, Sparkles, Receipt } from 'lucide-react';

export default function Salary() {
  const { workers, attendanceHistory, disbursedWages, disburseWage, dateRange } = useApp();
  const [cashAdvances, setCashAdvances] = useState({
    'WRK-01': 200,
    'WRK-03': 150,
  });
  const [successToast, setSuccessToast] = useState('');

  // Calculate stats for each worker
  const payrollDetails = workers.map((worker) => {
    let daysPresent = 0;
    let totalOtHours = 0;

    attendanceHistory.forEach((historyItem) => {
      const record = historyItem.records[worker.id];
      if (record) {
        if (record.status === 'Present') {
          daysPresent += 1;
        } else if (record.status === 'Half-Day') {
          daysPresent += 0.5;
        }
        if (record.ot) {
          totalOtHours += record.ot;
        }
      }
    });

    // OT Pay Formula: (Daily Wage / 8 hours) * 1.5 multiplier * OT Hours
    const otRate = (worker.wage / 8) * 1.5;
    const otPay = Math.round(totalOtHours * otRate);

    // Deductions/Advances
    const advance = cashAdvances[worker.id] || 0;

    // Gross and Net Payable
    const grossWage = Math.round(daysPresent * worker.wage);
    const netPayable = Math.max(0, grossWage + otPay - advance);

    // Status from global context
    const statusInfo = disbursedWages[worker.id] || { status: 'Pending' };

    return {
      ...worker,
      daysPresent,
      totalOtHours,
      otPay,
      advance,
      grossWage,
      netPayable,
      status: statusInfo.status,
      paidDate: statusInfo.date,
    };
  });

  const handleAdvanceChange = (workerId, value) => {
    const amt = Math.max(0, parseFloat(value) || 0);
    setCashAdvances((prev) => ({
      ...prev,
      [workerId]: amt,
    }));
  };

  const handleDisburse = (workerId, amount, workerName) => {
    disburseWage(workerId, amount);
    setSuccessToast(`Disbursement of ₹${amount.toLocaleString()} cleared for ${workerName}! Debit entry logged to ledger account.`);
    setTimeout(() => {
      setSuccessToast('');
    }, 4000);
  };

  // Aggregated Summary Stats
  const totalBudget = payrollDetails.reduce((acc, curr) => acc + curr.netPayable, 0);
  const totalPaid = payrollDetails
    .filter((w) => w.status === 'Paid')
    .reduce((acc, curr) => acc + curr.netPayable, 0);
  const totalPending = totalBudget - totalPaid;
  const totalOtPaid = payrollDetails.reduce((acc, curr) => acc + curr.otPay, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Worker Payroll Registry</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calculate wages based on attendance roster, process overtime hours, audit advances, and disburse wages.</p>
        </div>
      </div>

      {successToast && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-3.5 rounded text-xs flex items-center space-x-2.5">
          <Receipt className="h-4.5 w-4.5 shrink-0 animate-bounce" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Budget */}
        <div className="bg-white border border-slate-200 rounded-lg p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Total Est. Payroll</span>
            <h3 className="text-lg font-black text-slate-900 mt-1">₹{totalBudget.toLocaleString()}</h3>
          </div>
          <div className="p-2.5 bg-slate-50 text-slate-500 rounded-lg">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
        </div>

        {/* Paid Wages */}
        <div className="bg-white border border-slate-200 rounded-lg p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-semibold">Wages Disbursed</span>
            <h3 className="text-lg font-black text-emerald-650 mt-1">₹{totalPaid.toLocaleString()}</h3>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-650 rounded-lg">
            <Check className="h-5 w-5" />
          </div>
        </div>

        {/* Pending Payout */}
        <div className="bg-white border border-slate-200 rounded-lg p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Outstanding Net Pay</span>
            <h3 className="text-lg font-black text-amber-650 mt-1 font-semibold">₹{totalPending.toLocaleString()}</h3>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <Send className="h-5 w-5" />
          </div>
        </div>

        {/* Total OT Premium */}
        <div className="bg-white border border-slate-200 rounded-lg p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Overtime Premiums</span>
            <h3 className="text-lg font-black text-sky-650 mt-1">₹{totalOtPaid.toLocaleString()}</h3>
          </div>
          <div className="p-2.5 bg-sky-50 text-sky-600 rounded-lg">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Payroll spreadsheet */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden flex flex-col">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex justify-between items-center text-xs">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Active Payroll Sheet</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Period: <span className="font-semibold text-slate-500">{dateRange.fromDate}</span> to <span className="font-semibold text-slate-500">{dateRange.toDate}</span></p>
          </div>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
            Live Calculations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-3">Worker ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Daily Rate</th>
                <th className="px-6 py-3 text-center">Days Worked</th>
                <th className="px-6 py-3 text-center">OT Hours</th>
                <th className="px-6 py-3 text-right">OT Pay</th>
                <th className="px-6 py-3 text-center">Advances / Deductions (₹)</th>
                <th className="px-6 py-3 text-right">Net Payable</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payrollDetails.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                  {/* ID */}
                  <td className="px-6 py-3.5 text-slate-500 font-mono font-semibold">{row.id}</td>
                  
                  {/* Name */}
                  <td className="px-6 py-3.5 font-bold text-slate-900">
                    <div>
                      <span>{row.name}</span>
                      <span className="block text-[9px] text-slate-400 font-normal uppercase tracking-wide">{row.type}</span>
                    </div>
                  </td>
                  
                  {/* Wage */}
                  <td className="px-6 py-3.5 text-slate-650 font-bold">₹{row.wage}</td>
                  
                  {/* Days worked */}
                  <td className="px-6 py-3.5 text-center font-mono font-bold text-slate-700">{row.daysPresent} days</td>
                  
                  {/* OT Hours */}
                  <td className="px-6 py-3.5 text-center font-mono font-semibold text-slate-500">{row.totalOtHours} hrs</td>
                  
                  {/* OT Pay */}
                  <td className="px-6 py-3.5 text-right font-mono font-bold text-sky-650">₹{row.otPay.toLocaleString()}</td>
                  
                  {/* Advances (Editable) */}
                  <td className="px-6 py-3.5">
                    <div className="flex justify-center">
                      <div className="relative w-24">
                        <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-slate-400 font-bold">₹</span>
                        <input
                          type="number"
                          min="0"
                          disabled={row.status === 'Paid'}
                          value={row.advance}
                          onChange={(e) => handleAdvanceChange(row.id, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded pl-5 pr-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono font-bold text-slate-700 text-center disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </td>
                  
                  {/* Net Payable */}
                  <td className="px-6 py-3.5 text-right font-mono font-extrabold text-slate-950">₹{row.netPayable.toLocaleString()}</td>
                  
                  {/* Action */}
                  <td className="px-6 py-3.5 text-right">
                    {row.status === 'Paid' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-250 text-emerald-700 font-bold text-[10px] uppercase tracking-wide">
                        <Check className="h-3 w-3" />
                        <span>Paid ({row.paidDate})</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDisburse(row.id, row.netPayable, row.name)}
                        disabled={row.netPayable <= 0}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-955 font-bold py-1 px-3 rounded text-[10px] transition-colors shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Disburse Wages
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
