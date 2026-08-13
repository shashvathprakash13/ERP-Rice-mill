import React, { useEffect, useState } from 'react';
import { UserPlus, Landmark, Database, X } from 'lucide-react';
import { apiRequest } from '../services/api';

export default function Supplier() {
  const [activeTab, setActiveTab] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newGst, setNewGst] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoading(true);
        const payload = await apiRequest('/suppliers');
        const data = payload?.suppliers || [];
        setSuppliers(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Unable to fetch suppliers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim() || !newAddress.trim()) {
      setError('Please fill in supplier name, phone, and address.');
      return;
    }

    try {
      const created = await apiRequest('/suppliers', {
        method: 'POST',
        body: JSON.stringify({
          supplierName: newName.trim(),
          phone: newPhone.trim(),
          address: newAddress.trim(),
          gst: newGst.trim(),
          balance: Number(newBalance || 0),
        }),
      });

      const supplier = created?.supplier || created;
      setSuppliers(prev => [supplier, ...prev]);
      setNewName('');
      setNewPhone('');
      setNewAddress('');
      setNewGst('');
      setNewBalance('');
      setIsAddModalOpen(false);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to create supplier');
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const type = supplier.supplierName ? 'Farmer' : 'Farmer';
    if (activeTab === 'all') return true;
    if (activeTab === 'farmers') return type === 'Farmer';
    if (activeTab === 'paiks') return false;
    if (activeTab === 'dealers') return false;
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Suppliers' },
    { id: 'farmers', label: 'Farmers' },
    { id: 'paiks', label: 'Paiks (Brokers)' },
    { id: 'dealers', label: 'Dealers/Businessmen' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Manage Suppliers</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track procurement directories, manage crop agents, outstanding balances, and silo stock targets.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded text-xs transition-colors shadow-xs cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* Tab Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 text-xs gap-3">
        {/* Tabs */}
        <div className="flex space-x-1 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-amber-500 text-slate-900 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full rounded border border-slate-200 bg-white p-4 text-sm text-slate-500">Loading suppliers...</div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="col-span-full rounded border border-slate-200 bg-white p-4 text-sm text-slate-500">No suppliers found.</div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <div key={supplier._id || supplier.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{supplier._id || supplier.id}</div>
                  <h3 className="font-bold text-sm text-slate-900 mt-0.5">{supplier.supplierName || supplier.name}</h3>
                </div>
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-100">
                  Supplier
                </span>
              </div>

              <div className="my-5 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="flex items-center"><Database className="h-3.5 w-3.5 text-slate-400 mr-1.5 shrink-0" /> Phone:</span>
                  <span className="font-semibold text-slate-700">{supplier.phone}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span className="flex items-center"><Landmark className="h-3.5 w-3.5 text-slate-400 mr-1.5 shrink-0" /> Address:</span>
                  <span className="font-semibold text-slate-800 text-right">{supplier.address}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded p-3 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Outstanding Balance:</span>
                <span className="font-extrabold text-slate-900">₹{Number(supplier.balance || 0).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Supplier Modal Overlay */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 transition-all">
          <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-md shadow-2xl overflow-hidden text-xs">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 px-6 py-4">
              <div className="flex items-center space-x-2 text-slate-100">
                <UserPlus className="h-4.5 w-4.5 text-amber-500" />
                <h3 className="font-bold text-sm">Add New Supplier Profile</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSupplier} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Supplier Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Haran Singh"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Phone</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">GST</label>
                  <input
                    type="text"
                    value={newGst}
                    onChange={(e) => setNewGst(e.target.value)}
                    placeholder="optional"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Address</label>
                <textarea
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Enter supplier address"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Initial Balance (₹)</label>
                <input
                  type="number"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold transition-colors cursor-pointer"
                >
                  Create Supplier Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
