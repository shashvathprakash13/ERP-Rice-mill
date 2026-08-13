import React, { useState } from 'react';
import { Database, ArrowLeftRight, Check, X, ShieldAlert, Archive } from 'lucide-react';

export default function Warehouse() {
  // Warehouse Tab Selection
  const [activeTab, setActiveTab] = useState('godown-a');
  
  // Modal visibility
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  
  // Stock transfer form states
  const [sourceWarehouse, setSourceWarehouse] = useState('godown-a');
  const [targetWarehouse, setTargetWarehouse] = useState('godown-b');
  const [transferProduct, setTransferProduct] = useState('Sona Masuri Raw');
  const [transferQty, setTransferQty] = useState('');
  const [transferBay, setTransferBay] = useState('BAY-08');
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Warehouse inventory states
  const [inventory, setInventory] = useState({
    'godown-a': [
      { product: 'Sona Masuri Raw', stock: 4800, allocated: 1200, unit: 'Bags', bay: 'BAY-01' },
      { product: 'Jyothi Rice Raw', stock: 3200, allocated: 600, unit: 'Bags', bay: 'BAY-02' },
      { product: 'Basmati Paddy', stock: 1500, allocated: 0, unit: 'Quintals', bay: 'BAY-03' },
      { product: 'Jeera Rice Raw', stock: 2400, allocated: 400, unit: 'Bags', bay: 'BAY-04' },
    ],
    'godown-b': [
      { product: 'Sona Masuri Polished', stock: 3500, allocated: 1500, unit: 'Bags', bay: 'BAY-05' },
      { product: 'Basmati Premium', stock: 1200, allocated: 500, unit: 'Bags', bay: 'BAY-06' },
      { product: 'Jyothi Rice Finished', stock: 1800, allocated: 300, unit: 'Bags', bay: 'BAY-07' },
      { product: 'Husk Bags (Byproduct)', stock: 5000, allocated: 1000, unit: 'Bags', bay: 'BAY-08' },
    ],
    'silos': [
      { product: 'Premium Basmati Paddy', stock: 950, allocated: 200, unit: 'Quintals', bay: 'SILO-01' },
      { product: 'Sona Masuri Paddy', stock: 1200, allocated: 400, unit: 'Quintals', bay: 'SILO-02' },
      { product: 'Jyothi Paddy Bulk', stock: 850, allocated: 0, unit: 'Quintals', bay: 'SILO-03' },
    ]
  });

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    setTransferError('');
    setTransferSuccess(false);

    const qty = parseInt(transferQty);
    if (!qty || qty <= 0) {
      setTransferError('Please enter a valid transfer quantity.');
      return;
    }

    if (sourceWarehouse === targetWarehouse) {
      setTransferError('Source and Target warehouses cannot be identical.');
      return;
    }

    // Check if product exists in source and has enough stock
    const sourceList = inventory[sourceWarehouse];
    const sourceItemIndex = sourceList.findIndex(i => i.product.toLowerCase().includes(transferProduct.split(' ')[0].toLowerCase()));

    if (sourceItemIndex === -1) {
      setTransferError(`Product type not found in selected Source warehouse.`);
      return;
    }

    const sourceItem = sourceList[sourceItemIndex];
    if (sourceItem.stock < qty) {
      setTransferError(`Insufficient stock. Available: ${sourceItem.stock} ${sourceItem.unit}.`);
      return;
    }

    // Validated: Perform Stock Transfer
    const updatedInventory = { ...inventory };

    // Deduct from source
    updatedInventory[sourceWarehouse][sourceItemIndex].stock -= qty;

    // Add to target (check if product exists in target first, otherwise append it)
    const targetList = updatedInventory[targetWarehouse];
    const targetItemIndex = targetList.findIndex(i => i.product.toLowerCase().includes(transferProduct.split(' ')[0].toLowerCase()));

    if (targetItemIndex !== -1) {
      updatedInventory[targetWarehouse][targetItemIndex].stock += qty;
    } else {
      // Create new stock entry in target
      updatedInventory[targetWarehouse].push({
        product: `${transferProduct.split(' ')[0]} Relocated`,
        stock: qty,
        allocated: 0,
        unit: sourceItem.unit,
        bay: transferBay,
      });
    }

    setInventory(updatedInventory);
    setTransferQty('');
    setTransferSuccess(true);

    // Close modal after delay
    setTimeout(() => {
      setTransferSuccess(false);
      setIsTransferModalOpen(false);
    }, 1200);
  };

  const tabs = [
    { id: 'godown-a', label: 'Godown A (Raw Paddy Storage)' },
    { id: 'godown-b', label: 'Godown B (Finished Goods)' },
    { id: 'silos', label: 'Silo Complexes' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Warehouse & Stock Inventory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Monitor stock levels, track storage bay allocations, and register internal stock relocations.</p>
        </div>
        <div>
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded text-xs transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Internal Stock Transfer</span>
          </button>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-slate-200 text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 font-semibold -mb-px border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-amber-500 text-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stock Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="px-5 py-3">Product Type</th>
              <th className="px-5 py-3">Total Available Stock</th>
              <th className="px-5 py-3">Allocated/Reserved Space</th>
              <th className="px-5 py-3 text-right">Location Bay ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(inventory[activeTab] || []).map((item, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5 font-bold text-slate-900">{item.product}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-800">
                  {item.stock.toLocaleString()} {item.unit}
                </td>
                <td className="px-5 py-3.5 text-slate-500 font-medium">
                  {item.allocated > 0 ? `${item.allocated.toLocaleString()} ${item.unit}` : 'None'}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold">
                    <Archive className="h-3 w-3 text-slate-400 shrink-0" />
                    <span>{item.bay}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Internal Stock Transfer Modal Popup */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 transition-all">
          <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden text-xs">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 px-6 py-4">
              <div className="flex items-center space-x-2 text-slate-100">
                <ArrowLeftRight className="h-4.5 w-4.5 text-amber-500" />
                <h3 className="font-bold text-sm">Register Internal Stock Transfer</h3>
              </div>
              <button 
                onClick={() => setIsTransferModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleTransferSubmit} className="p-6 space-y-4">
              {transferError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-[11px] flex items-center space-x-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span className="font-medium">{transferError}</span>
                </div>
              )}

              {transferSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded text-[11px] flex items-center space-x-2">
                  <Check className="h-4 w-4 shrink-0" />
                  <span className="font-semibold">Stock transfer completed and ledger entries recorded.</span>
                </div>
              )}

              {/* Source & Target Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Source Storage</label>
                  <select
                    value={sourceWarehouse}
                    onChange={(e) => setSourceWarehouse(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="godown-a">Godown A (Raw Paddy)</option>
                    <option value="godown-b">Godown B (Finished)</option>
                    <option value="silos">Silo Complexes</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Target Destination</label>
                  <select
                    value={targetWarehouse}
                    onChange={(e) => setTargetWarehouse(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="godown-a">Godown A (Raw Paddy)</option>
                    <option value="godown-b">Godown B (Finished)</option>
                    <option value="silos">Silo Complexes</option>
                  </select>
                </div>
              </div>

              {/* Product Type & Target Bay */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Product Selection</label>
                  <select
                    value={transferProduct}
                    onChange={(e) => setTransferProduct(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Sona Masuri">Sona Masuri</option>
                    <option value="Jyothi Rice">Jyothi Rice</option>
                    <option value="Basmati Premium">Basmati Premium</option>
                    <option value="Jeera Rice">Jeera Rice</option>
                    <option value="Husk Bags">Husk Bags</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Target Bay ID</label>
                  <input
                    type="text"
                    required
                    value={transferBay}
                    onChange={(e) => setTransferBay(e.target.value)}
                    placeholder="e.g. BAY-09"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Transfer Quantity */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Transfer Quantity</label>
                <input
                  type="number"
                  required
                  value={transferQty}
                  onChange={(e) => setTransferQty(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold transition-colors cursor-pointer"
                >
                  Execute Stock Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
