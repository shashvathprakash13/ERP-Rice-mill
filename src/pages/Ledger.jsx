import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Calendar, Search, FileDown, Landmark, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function Ledger() {
  const { dateRange, setDateRange } = useApp();
  
  // List of accounts available for statement generation
  const accounts = [
    { id: 'ACC-01', name: 'Sri Balaji Traders (Dealer)', type: 'Supplier' },
    { id: 'ACC-02', name: 'Ramesh Kumar (Farmer)', type: 'Supplier' },
    { id: 'ACC-03', name: 'Hindustan Rice Exports', type: 'Buyer' },
    { id: 'ACC-04', name: 'Metro Supermarkets', type: 'Buyer' },
  ];

  const [selectedAccId, setSelectedAccId] = useState('ACC-01');

  // Pre-configured ledger transaction data for each account
  const ledgerData = {
    'ACC-01': [
      { date: '2026-06-01', particulars: 'Opening Balance Ledger', docRef: 'OPB-2026', debit: 0, credit: 0 },
      { date: '2026-06-03', particulars: 'Raw Paddy Procurement Gate Pass', docRef: 'GP-26-411', debit: 0, credit: 1748500 },
      { date: '2026-06-16', particulars: 'Bank Disbursement - RTGS Clearing', docRef: 'RTGS-889012', debit: 500000, credit: 0 },
    ],
    'ACC-02': [
      { date: '2026-06-01', particulars: 'Opening Balance Ledger', docRef: 'OPB-2026', debit: 0, credit: 0 },
      { date: '2026-06-02', particulars: 'Raw Paddy Procurement Gate Pass', docRef: 'GP-26-412', debit: 0, credit: 360000 },
      { date: '2026-06-15', particulars: 'Bank Disbursement - NEFT Clearing', docRef: 'NEFT-452301', debit: 120000, credit: 0 },
    ],
    'ACC-03': [
      { date: '2026-06-01', particulars: 'Opening Balance Ledger', docRef: 'OPB-2026', debit: 0, credit: 0 },
      { date: '2026-06-05', particulars: 'Premium Basmati Bags Dispatch Invoice', docRef: 'INV-26-102', debit: 1300000, credit: 0 },
      { date: '2026-06-14', particulars: 'Advance Bank Receipt - Wire Transfer', docRef: 'RTGS-112040', debit: 0, credit: 850000 },
    ],
    'ACC-04': [
      { date: '2026-06-01', particulars: 'Opening Balance Ledger', docRef: 'OPB-2026', debit: 0, credit: 0 },
      { date: '2026-06-06', particulars: 'Sona Masuri Bags Dispatch Invoice', docRef: 'INV-26-103', debit: 320000, credit: 0 },
      { date: '2026-06-12', particulars: 'Invoice Payment - Cheque Recieved', docRef: 'CHQ-889011', debit: 0, credit: 200000 },
    ],
  };

  const [statement, setStatement] = useState([]);
  const selectedAcc = accounts.find(a => a.id === selectedAccId) || accounts[0];

  // Generate statement with running cumulative balance
  useEffect(() => {
    const rawTxns = ledgerData[selectedAccId] || [];
    let runningBalance = 0;

    const statementLines = rawTxns.map((txn) => {
      // For Suppliers (credits increase what we owe them, debits decrease it)
      // For Buyers (debits increase what they owe us, credits decrease it)
      if (selectedAcc.type === 'Supplier') {
        runningBalance = runningBalance + txn.credit - txn.debit;
      } else {
        runningBalance = runningBalance + txn.debit - txn.credit;
      }

      return {
        ...txn,
        balance: runningBalance
      };
    });

    setStatement(statementLines);
  }, [selectedAccId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Account Statements</h2>
          <p className="text-xs text-slate-500 mt-0.5">Generate and review transaction ledgers, debits, credits, and outstanding reconciliations.</p>
        </div>
      </div>

      {/* Filter and selector toolbar */}
      <div className="bg-white/70 border border-slate-200/50 rounded-lg p-4 shadow-xs space-y-3.5 text-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          
          {/* Account Selection */}
          <div className="space-y-1.5 w-full md:w-80">
            <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Select Ledger Account</label>
            <select
              value={selectedAccId}
              onChange={(e) => setSelectedAccId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-slate-800 cursor-pointer"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="flex space-x-3 items-end w-full md:w-auto">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">From Date</label>
              <input
                type="date"
                value={dateRange.fromDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, fromDate: e.target.value }))}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-700 font-semibold cursor-pointer"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">To Date</label>
              <input
                type="date"
                value={dateRange.toDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, toDate: e.target.value }))}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-700 font-semibold cursor-pointer"
              />
            </div>
            <button
              onClick={() => alert('PDF statement downloading to local downloads.')}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-3.5 rounded transition-colors shadow-xs cursor-pointer"
              title="Download Statement"
            >
              <FileDown className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>

        </div>
      </div>

      {/* Account Statement Ledger Sheet */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden flex flex-col">
        {/* Ledger Sheet Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Statement of Account</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Account ID: <span className="font-semibold">{selectedAcc.id}</span> | Statement Type: <span className="font-semibold text-slate-700">{selectedAcc.type} Statement</span></p>
          </div>
          <div className="text-right text-slate-500 text-xs">
            Period: <span className="font-bold text-slate-750">{dateRange.fromDate}</span> to <span className="font-bold text-slate-750">{dateRange.toDate}</span>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Particulars Description</th>
                <th className="px-6 py-3">Doc Ref ID</th>
                <th className="px-6 py-3 text-right">Debit (Dr)</th>
                <th className="px-6 py-3 text-right">Credit (Cr)</th>
                <th className="px-6 py-3 text-right">Cumulative Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {statement.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 text-slate-500 font-semibold">{row.date}</td>
                  <td className="px-6 py-3.5 text-slate-800 font-medium">{row.particulars}</td>
                  <td className="px-6 py-3.5 text-slate-600 font-mono font-semibold">{row.docRef}</td>
                  
                  {/* Debit */}
                  <td className="px-6 py-3.5 text-right font-mono">
                    {row.debit > 0 ? (
                      <span className="text-slate-800 font-bold">₹{row.debit.toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>

                  {/* Credit */}
                  <td className="px-6 py-3.5 text-right font-mono">
                    {row.credit > 0 ? (
                      <span className="text-slate-800 font-bold">₹{row.credit.toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>

                  {/* Cumulative Balance */}
                  <td className="px-6 py-3.5 text-right font-mono font-extrabold text-slate-900">
                    ₹{row.balance.toLocaleString()}
                    {row.balance > 0 ? (
                      <span className="text-[9px] text-slate-400 font-bold ml-1">{selectedAcc.type === 'Supplier' ? 'Cr' : 'Dr'}</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ledger Sheet Footer summary */}
        <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex justify-between items-center text-xs">
          <div className="flex items-center space-x-2 text-slate-400 font-medium">
            <BookOpen className="h-4 w-4" />
            <span>Reconciliation checklist status: Verified</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 font-semibold mr-2">Net Closing Balance:</span>
            <span className="font-black text-slate-950 text-sm">
              ₹{statement.length > 0 ? statement[statement.length - 1].balance.toLocaleString() : '0'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
