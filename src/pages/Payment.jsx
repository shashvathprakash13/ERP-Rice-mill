import React, { useState } from 'react';
import { CreditCard, Landmark, CheckCircle, Search, Calendar, FileText, Check } from 'lucide-react';

export default function Payment() {
  // Mock list of parties (combined suppliers and buyers)
  const parties = [
    { name: 'Ramesh Kumar (Farmer)', type: 'Supplier' },
    { name: 'Siva Prasad (Paik)', type: 'Supplier' },
    { name: 'Sri Balaji Traders (Dealer)', type: 'Supplier' },
    { name: 'Hindustan Rice Exports', type: 'Buyer' },
    { name: 'Metro Supermarkets', type: 'Buyer' },
    { name: 'Karnataka Retail Corp', type: 'Buyer' },
  ];

  // Transactions local state
  const [transactions, setTransactions] = useState([
    { id: 'TXN-26-485', date: '2026-06-16', party: 'Sri Balaji Traders (Dealer)', amount: 500000, type: 'Part Payment', mode: 'Bank Transfer', refNo: 'RTGS-889012' },
    { id: 'TXN-26-484', date: '2026-06-15', party: 'Ramesh Kumar (Farmer)', amount: 120000, type: 'Final Settlement', mode: 'Bank Transfer', refNo: 'NEFT-452301' },
    { id: 'TXN-26-483', date: '2026-06-14', party: 'Hindustan Rice Exports', amount: 850000, type: 'Advance', mode: 'Cheque', refNo: 'CHQ-004523' },
    { id: 'TXN-26-482', date: '2026-06-13', party: 'Siva Prasad (Paik)', amount: 350000, type: 'Part Payment', mode: 'Bank Transfer', refNo: 'RTGS-112040' },
  ]);

  // Form states
  const [selectedParty, setSelectedParty] = useState(parties[0].name);
  const [paymentType, setPaymentType] = useState('Part Payment');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Bank Transfer');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountVal = parseInt(amount);
    if (!amountVal || amountVal <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    const nextTxnId = `TXN-26-${Math.floor(486 + Math.random() * 100)}`;
    const randomRef = paymentMode === 'Cash' ? 'CASH-REC' : 
                      paymentMode === 'Cheque' ? `CHQ-${Math.floor(100000 + Math.random() * 900000)}` : 
                      `RTGS-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTxn = {
      id: nextTxnId,
      date: new Date().toISOString().split('T')[0],
      party: selectedParty,
      amount: amountVal,
      type: paymentType,
      mode: paymentMode,
      refNo: randomRef,
    };

    setTransactions([newTxn, ...transactions]);
    setAmount('');
    setSuccessMsg(true);

    setTimeout(() => {
      setSuccessMsg(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Payment Control Center</h2>
          <p className="text-xs text-slate-500 mt-0.5">Post advance and part payments, reconcile grain sales receipts, and print transaction bank sheets.</p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-3.5 rounded text-xs flex items-center space-x-2.5">
          <Check className="h-4.5 w-4.5 shrink-0" />
          <span className="font-semibold">Payment cleared successfully! Bank voucher generated and ledger adjusted.</span>
        </div>
      )}

      {/* Grid: Form (Left) & Ledger (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3.5 mb-4">
            <CreditCard className="h-4.5 w-4.5 text-slate-500" />
            <h3 className="font-semibold text-slate-900 text-sm">New Payment Entry</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Account Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Account Selection</label>
              <select
                value={selectedParty}
                onChange={(e) => setSelectedParty(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-800 font-semibold cursor-pointer"
              >
                {parties.map((p, idx) => (
                  <option key={idx} value={p.name}>{p.name} ({p.type})</option>
                ))}
              </select>
            </div>

            {/* Payment Type & Mode */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Payment Type</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-800 font-medium"
                >
                  <option value="Advance">Advance Payment</option>
                  <option value="Part Payment">Part Payment</option>
                  <option value="Final Settlement">Final Settlement</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-800 font-medium"
                >
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="Cheque">Demand Draft / Cheque</option>
                  <option value="Cash">Cash Ledger</option>
                </select>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Amount (₹)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 150000"
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs font-semibold text-slate-850"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded font-bold transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer mt-4"
            >
              <CheckCircle className="h-4.5 w-4.5" />
              <span>Clear Dues / Save Voucher</span>
            </button>
          </form>
        </div>

        {/* Right: Ledger (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3.5 mb-4 justify-between">
            <div className="flex items-center space-x-2">
              <Landmark className="h-4.5 w-4.5 text-slate-500" />
              <h3 className="font-semibold text-slate-900 text-sm">Recent Transactions Ledger</h3>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-650 px-2 py-0.5 rounded font-bold uppercase">
              Live Bank Ledger
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="px-4 py-2.5">Txn ID</th>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Party Name</th>
                  <th className="px-4 py-2.5">Amount</th>
                  <th className="px-4 py-2.5">Ref Number</th>
                  <th className="px-4 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-slate-500">{txn.id}</td>
                    <td className="px-4 py-2.5 text-slate-500">{txn.date}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-800">{txn.party}</td>
                    <td className="px-4 py-2.5 text-slate-900 font-bold font-mono">₹{txn.amount.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-slate-500 font-mono">{txn.refNo}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold">
                        Settled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
