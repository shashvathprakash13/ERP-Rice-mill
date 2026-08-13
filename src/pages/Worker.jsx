import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, User, Shield, Briefcase, Phone, DollarSign, Plus, Search, X, CheckCircle } from 'lucide-react';

export default function Worker() {
  const { workers, addWorker } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Form states for new worker
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Daily-Waged');
  const [newSection, setNewSection] = useState('Sorting');
  const [newWage, setNewWage] = useState('');
  const [newMobile, setNewMobile] = useState('');

  // Handle adding new worker
  const handleAddWorkerSubmit = (e) => {
    e.preventDefault();
    if (!newName || !newWage || !newMobile) {
      alert('Please fill out all required fields.');
      return;
    }

    const nextIdNum = workers.length + 1;
    const paddedId = nextIdNum < 10 ? `0${nextIdNum}` : `${nextIdNum}`;
    const newWorker = {
      id: `WRK-${paddedId}`,
      name: newName,
      type: newType,
      section: newSection,
      wage: parseFloat(newWage) || 0,
      mobile: newMobile,
    };

    addWorker(newWorker);

    // Reset Form & Close Modal
    setNewName('');
    setNewWage('');
    setNewMobile('');
    setIsModalOpen(false);

    // Show Success Alert
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };

  // Filter workers based on search & tab
  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          worker.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          worker.section.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (activeTab === 'all') return true;
    if (activeTab === 'seasonal') return worker.type === 'Seasonal';
    if (activeTab === 'daily') return worker.type === 'Daily-Waged';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Workers' },
    { id: 'seasonal', label: 'Seasonal Workers' },
    { id: 'daily', label: 'Daily-Waged Basis' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Worker Records Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage permanent mill operators, seasonal crop-cycle loaders, and daily-waged sorting shifts.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-955 font-bold py-1.5 px-3.5 rounded text-xs transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Worker</span>
        </button>
      </div>

      {showSuccessAlert && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-3.5 rounded text-xs flex items-center space-x-2.5">
          <CheckCircle className="h-4.5 w-4.5 shrink-0" />
          <span className="font-semibold">New worker added successfully to roster database!</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Tab Filter bar */}
        <div className="flex border-b border-slate-200/60 text-xs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-amber-500 text-slate-900 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 text-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-450">
            <Search className="h-3.5 w-3.5" />
          </span>
          <input
            type="text"
            placeholder="Search Name, ID, Section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/80 border border-slate-200 rounded pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-700"
          />
        </div>
      </div>

      {/* Roster Grid */}
      {filteredWorkers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => (
            <div key={worker.id} className="bg-white border border-slate-250 rounded-lg p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              {/* Top row */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">{worker.id}</span>
                  <h3 className="font-bold text-sm text-slate-900 mt-0.5">{worker.name}</h3>
                </div>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  worker.type === 'Seasonal' ? 'bg-sky-50 text-sky-700 border-sky-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                }`}>
                  {worker.type}
                </span>
              </div>

              {/* Middle details */}
              <div className="my-5 space-y-2.5 text-xs text-slate-500">
                <div className="flex justify-between items-center">
                  <span className="flex items-center"><Briefcase className="h-3.5 w-3.5 mr-1.5 text-slate-450 shrink-0" /> Section:</span>
                  <span className="font-semibold text-slate-800">{worker.section}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center"><Phone className="h-3.5 w-3.5 mr-1.5 text-slate-450 shrink-0" /> Mobile Number:</span>
                  <span className="font-semibold text-slate-850 font-mono">{worker.mobile}</span>
                </div>
              </div>

              {/* Bottom Wage box */}
              <div className="bg-slate-50/60 border border-slate-100 rounded p-3 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Daily Wage Rate:</span>
                <span className="font-extrabold text-slate-900 flex items-center">
                  <DollarSign className="h-3 w-3 mr-0.5 text-slate-500" />
                  ₹{worker.wage} / day
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/80 border border-slate-200 rounded-lg p-12 text-center text-slate-450 text-xs">
          No workers found matching the active filters.
        </div>
      )}

      {/* Add Worker Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-900 flex items-center">
                <Users className="h-4 w-4 mr-2 text-slate-500" />
                Register New Mill Worker
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddWorkerSubmit} className="p-5 space-y-4 text-xs">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Worker Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 font-medium"
                />
              </div>

              {/* Grid 2 Column */}
              <div className="grid grid-cols-2 gap-4">
                {/* Worker Type */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Employment Type *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-850 cursor-pointer"
                  >
                    <option value="Daily-Waged">Daily-Waged</option>
                    <option value="Seasonal">Seasonal</option>
                  </select>
                </div>

                {/* Section */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Assigned Section *</label>
                  <select
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-850 cursor-pointer"
                  >
                    <option value="Sorting">Sorting</option>
                    <option value="Weighbridge">Weighbridge</option>
                    <option value="Silo 2">Silo 2</option>
                    <option value="Packing">Packing</option>
                    <option value="Boiler Line">Boiler Line</option>
                    <option value="Warehouse 1">Warehouse 1</option>
                  </select>
                </div>
              </div>

              {/* Grid 2 Column */}
              <div className="grid grid-cols-2 gap-4">
                {/* Daily Wage */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Daily Wage (₹/day) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    placeholder="e.g. 500"
                    value={newWage}
                    onChange={(e) => setNewWage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 font-medium"
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="98765 00000"
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-850 font-mono font-medium"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-150 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-250 text-slate-600 font-semibold py-1.5 px-3.5 rounded transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-955 font-bold py-1.5 px-4 rounded transition-colors shadow-xs cursor-pointer"
                >
                  Save Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
