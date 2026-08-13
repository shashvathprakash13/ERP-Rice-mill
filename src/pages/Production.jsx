import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Play, Clock, BarChart3, Database, Layers, CheckCircle } from 'lucide-react';

export default function Production() {
  const { warehouses } = useApp();

  // Active milling batches state
  const [batches, setBatches] = useState([
    { id: 'B-26-089', silo: 'Silo B', variety: 'Sona Masuri', weight: 250, stage: 'Milling', progress: 65, elapsed: '1h 12m' },
    { id: 'B-26-090', silo: 'Godown 1', variety: 'Jyothi Rice', weight: 180, stage: 'Drying', progress: 30, elapsed: '0h 45m' },
    { id: 'B-26-087', silo: 'Silo B', variety: 'Jeera Rice', weight: 150, stage: 'Cleaning', progress: 15, elapsed: '0h 18m' },
  ]);

  // Form states
  const [sourceSilo, setSourceSilo] = useState('silo-1');
  const [paddyVariety, setPaddyVariety] = useState('Sona Masuri');
  const [batchWeight, setBatchWeight] = useState('');
  const [launchSuccess, setLaunchSuccess] = useState(false);

  const handleLaunch = (e) => {
    e.preventDefault();
    const weightVal = parseFloat(batchWeight);
    if (!weightVal || weightVal <= 0) {
      alert('Please enter a valid batch weight in Quintals.');
      return;
    }

    const selectedSiloName = warehouses.find(w => w.id === sourceSilo)?.name || 'Silo A';
    // Clean silo name for display (e.g. Silo A - Premium -> Silo A)
    const displaySiloName = selectedSiloName.split(' - ')[0];

    const newBatchId = `B-26-0${Math.floor(92 + Math.random() * 10)}`;
    const newBatch = {
      id: newBatchId,
      silo: displaySiloName,
      variety: paddyVariety,
      weight: weightVal,
      stage: 'Cleaning',
      progress: 5,
      elapsed: '0h 01m',
    };

    setBatches([newBatch, ...batches]);
    setBatchWeight('');
    setLaunchSuccess(true);

    setTimeout(() => {
      setLaunchSuccess(false);
    }, 3000);
  };

  // Yield estimation calculation helper (standard mill recovery averages)
  const calculateRecovery = (inputWeight) => {
    return {
      headRice: (inputWeight * 0.52).toFixed(1),
      broken: (inputWeight * 0.164).toFixed(1),
      husk: (inputWeight * 0.20).toFixed(1),
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Milling Entry & Production</h2>
          <p className="text-xs text-slate-500 mt-0.5">Control milling batches, initiate sorting and cleaning runs, and monitor active processing yields.</p>
        </div>
      </div>

      {launchSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-3.5 rounded text-xs flex items-center space-x-2.5">
          <CheckCircle className="h-4.5 w-4.5 shrink-0" />
          <span className="font-semibold">Milling run initialized! Steam boilers and sorting grids configured.</span>
        </div>
      )}

      {/* Top Section: Launch Controller */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3 mb-4">
          <Play className="h-4 w-4 text-slate-500" />
          <h3 className="font-semibold text-slate-900 text-sm">Launch New Milling Batch</h3>
        </div>

        <form onSubmit={handleLaunch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-xs">
          {/* Source Silo */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Source Storage</label>
            <select
              value={sourceSilo}
              onChange={(e) => setSourceSilo(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-800 font-medium cursor-pointer"
            >
              {warehouses.filter(w => w.id !== 'all').map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          {/* Variety */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Paddy Variety</label>
            <select
              value={paddyVariety}
              onChange={(e) => setPaddyVariety(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-800 font-medium cursor-pointer"
            >
              <option value="Sona Masuri">Sona Masuri</option>
              <option value="Jyothi Rice">Jyothi Rice</option>
              <option value="Basmati Rice">Basmati (Premium)</option>
              <option value="Jeera Rice">Jeera Rice</option>
            </select>
          </div>

          {/* Input weight (Quintals) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Batch Weight (Quintals)</label>
            <input
              type="number"
              required
              value={batchWeight}
              onChange={(e) => setBatchWeight(e.target.value)}
              placeholder="e.g. 200"
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs font-semibold text-slate-850"
            />
          </div>

          {/* Initialize Button */}
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded transition-colors shadow-xs flex items-center justify-center space-x-2 cursor-pointer h-8"
          >
            <Flame className="h-4 w-4" />
            <span>Initialize Milling Run</span>
          </button>
        </form>
      </div>

      {/* Bottom Section: Yield Grid */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Layers className="h-4.5 w-4.5 text-slate-500" />
          <h3 className="font-semibold text-slate-900 text-sm">Active Milling Yield Monitoring</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {batches.map((batch) => {
            const recovery = calculateRecovery(batch.weight);
            return (
              <div key={batch.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
                {/* Card Top */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-xs">{batch.id}</span>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {batch.stage}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-medium text-slate-500">Source: <span className="font-bold text-slate-700">{batch.silo}</span></div>
                    <div className="text-sm font-bold text-slate-900">{batch.variety} ({batch.weight} Qt)</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="my-4 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> Run Time: {batch.elapsed}</span>
                    <span>{batch.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${batch.progress}%` }}></div>
                  </div>
                </div>

                {/* Yield Estimations */}
                <div className="bg-slate-50 border border-slate-100 rounded p-3 space-y-2 text-[11px]">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Est. Head Rice (52%):</span>
                    <span className="text-slate-800 font-bold">{recovery.headRice} Qt</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Est. Broken (16.4%):</span>
                    <span className="text-slate-800 font-bold">{recovery.broken} Qt</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium border-t border-slate-200/50 pt-1.5">
                    <span>Husk Byproduct (20%):</span>
                    <span className="text-slate-800 font-bold">{recovery.husk} Qt</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
