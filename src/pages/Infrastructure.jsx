import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Settings, Wrench, Truck, Zap, AlertTriangle, CheckCircle, Plus, FileText, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';

export default function Infrastructure() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dateRange } = useApp();

  const currentPath = location.pathname;

  // Determine active tab from URL path
  const getActiveTab = () => {
    if (currentPath === '/maintenance') return 'maintenance';
    if (currentPath === '/transport') return 'transport';
    if (currentPath === '/electricity') return 'electricity';
    return 'spare-parts'; // Default to /spare-parts
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tabKey) => {
    if (tabKey === 'maintenance') navigate('/maintenance');
    else if (tabKey === 'transport') navigate('/transport');
    else if (tabKey === 'electricity') navigate('/electricity');
    else navigate('/spare-parts');
  };

  // ----------------------------------------------------
  // STATE & DATA FOR TAB A: SPARE PARTS INVENTORY
  // ----------------------------------------------------
  const [spares, setSpares] = useState([
    { id: 'SP-101', name: 'Rubber Rollers 10"', category: 'Milling Line', stock: 4, reorder: 6, unit: 'units', status: 'Low Stock' },
    { id: 'SP-102', name: 'Color Sorter Air Filters', category: 'Sorting Screen', stock: 2, reorder: 5, unit: 'units', status: 'Critical' },
    { id: 'SP-103', name: 'Elevator Lift Belt 8"', category: 'Grain Conveyor', stock: 15, reorder: 10, unit: 'meters', status: 'Optimal' },
    { id: 'SP-104', name: 'Packing Stitch Thread Spools', category: 'Bag Packing', stock: 45, reorder: 20, unit: 'spools', status: 'Optimal' },
    { id: 'SP-105', name: 'Turbine Gearbox Oil (ISO 320)', category: 'Lubricants', stock: 80, reorder: 50, unit: 'liters', status: 'Optimal' },
  ]);

  const [requisitions, setRequisitions] = useState([
    { id: 'PR-26-08', partName: 'Color Sorter Air Filters', qty: '10 units', vendor: 'Buhler Service India', status: 'Pending Approval' }
  ]);

  const [sparePartSelect, setSparePartSelect] = useState('Color Sorter Air Filters');
  const [spareQty, setSpareQty] = useState('');
  const [spareVendor, setSpareVendor] = useState('Buhler Service India');
  const [spareAlert, setSpareAlert] = useState(false);

  const handleSpareReorderSubmit = (e) => {
    e.preventDefault();
    if (!spareQty) return;

    const selectedPart = spares.find(s => s.name === sparePartSelect);
    const newReq = {
      id: `PR-26-0${requisitions.length + 8}`,
      partName: sparePartSelect,
      qty: `${spareQty} ${selectedPart ? selectedPart.unit : 'units'}`,
      vendor: spareVendor,
      status: 'Pending Approval'
    };

    setRequisitions([newReq, ...requisitions]);
    setSpareQty('');
    setSpareAlert(true);
    setTimeout(() => setSpareAlert(false), 3000);
  };

  // ----------------------------------------------------
  // STATE & DATA FOR TAB B: MACHINERY MAINTENANCE
  // ----------------------------------------------------
  const [maintenanceLogs, setMaintenanceLogs] = useState([
    { id: 'MC-01', machineName: 'Color Sorter #2', type: 'Calibration', lastDate: '2026-06-12', nextDate: '2026-07-12', vendor: 'Buhler Service India', cost: 15000, status: 'Completed' },
    { id: 'MC-02', machineName: 'Boiler De-stoner Section', type: 'Screen Replacement', lastDate: '2026-06-10', nextDate: '2026-07-10', vendor: 'Harish Engineering Works', cost: 8500, status: 'Completed' },
    { id: 'MC-03', machineName: 'High-Pressure Steam Boiler', type: 'Hydro-static Valve Audit', lastDate: '2026-04-15', nextDate: '2026-06-20', vendor: 'State Boiler Inspectors', cost: 25000, status: 'Scheduled' },
    { id: 'MC-04', machineName: 'Pre-cleaner Elevator #1', type: 'V-Belt Drive Fitment', lastDate: '2026-06-16', nextDate: '2026-08-16', vendor: 'Internal Mill Technicians', cost: 2400, status: 'Completed' },
  ]);

  const [mName, setMName] = useState('Color Sorter #2');
  const [mType, setMType] = useState('Routine Servicing');
  const [mDetails, setMDetails] = useState('');
  const [mVendor, setMVendor] = useState('');
  const [mCost, setMCost] = useState('');
  const [mStatus, setMStatus] = useState('Completed');
  const [mAlert, setMAlert] = useState(false);

  const handleMaintenanceSubmit = (e) => {
    e.preventDefault();
    if (!mVendor || !mCost) return;

    const nextId = `MC-0${maintenanceLogs.length + 1}`;
    const newLog = {
      id: nextId,
      machineName: mName,
      type: mType,
      lastDate: new Date().toISOString().split('T')[0],
      nextDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days later
      vendor: mVendor,
      cost: parseFloat(mCost) || 0,
      status: mStatus,
    };

    setMaintenanceLogs([newLog, ...maintenanceLogs]);
    setMDetails('');
    setMVendor('');
    setMCost('');
    setMAlert(true);
    setTimeout(() => setMAlert(false), 3000);
  };

  // ----------------------------------------------------
  // STATE & DATA FOR TAB C: LOGISTICS & TRANSPORT
  // ----------------------------------------------------
  const [dispatches, setDispatches] = useState([
    { id: 'DSP-26-891', truckNo: 'KA-19-M-2041', transporter: 'Sri Laxmi Transport', destination: 'Chennai Port (Basmati Export)', bags: 500, weight: 25.0, rate: 1800, totalBill: 45000, status: 'In Transit' },
    { id: 'DSP-26-890', truckNo: 'MH-12-QX-4012', transporter: 'Supreme Logistics LLC', destination: 'Bangalore Wholesale Yard', bags: 400, weight: 20.0, rate: 1500, totalBill: 30000, status: 'Delivered' },
    { id: 'DSP-26-889', truckNo: 'AP-03-TY-8890', transporter: 'Balaji Roadways Corp', destination: 'Hubli Central Godown', bags: 600, weight: 30.0, rate: 1200, totalBill: 36000, status: 'Delivered' },
    { id: 'DSP-26-892', truckNo: 'KA-34-H-1102', transporter: 'Sri Laxmi Transport', destination: 'Chennai Port (Basmati Export)', bags: 500, weight: 25.0, rate: 1800, totalBill: 45000, status: 'Loading' },
  ]);

  const [tTruck, setTTruck] = useState('');
  const [tTransporter, setTTransporter] = useState('Sri Laxmi Transport');
  const [tDest, setTDest] = useState('');
  const [tBags, setTBags] = useState('');
  const [tWeight, setTWeight] = useState('');
  const [tRate, setTRate] = useState('');
  const [tAlert, setTAlert] = useState(false);

  const handleDispatchSubmit = (e) => {
    e.preventDefault();
    if (!tTruck || !tDest || !tBags || !tWeight || !tRate) return;

    const bagsVal = parseInt(tBags) || 0;
    const weightVal = parseFloat(tWeight) || 0;
    const rateVal = parseFloat(tRate) || 0;
    const total = Math.round(weightVal * rateVal);

    const newDispatch = {
      id: `DSP-26-${Math.floor(893 + Math.random() * 50)}`,
      truckNo: tTruck.toUpperCase(),
      transporter: tTransporter,
      destination: tDest,
      bags: bagsVal,
      weight: weightVal,
      rate: rateVal,
      totalBill: total,
      status: 'Loading'
    };

    setDispatches([newDispatch, ...dispatches]);
    setTTruck('');
    setTDest('');
    setTBags('');
    setTWeight('');
    setTRate('');
    setTAlert(true);
    setTimeout(() => setTAlert(false), 3000);
  };

  // ----------------------------------------------------
  // STATE & DATA FOR TAB D: UTILITY BILL ENTRY
  // ----------------------------------------------------
  const [utilities, setUtilities] = useState([
    { period: 'June 2026 (Provisional)', meterId: 'MTR-BOILER-01', power: 85400, pf: 0.97, billAmt: 768600, diesel: 2400, dieselCost: 216000, turbine: 12000, status: 'Pending Approval' },
    { period: 'May 2026', meterId: 'MTR-BOILER-01', power: 92100, pf: 0.96, billAmt: 828900, diesel: 3100, dieselCost: 279000, turbine: 14500, status: 'Paid' },
    { period: 'April 2026', meterId: 'MTR-BOILER-01', power: 88500, pf: 0.95, billAmt: 796500, diesel: 2800, dieselCost: 252000, turbine: 11000, status: 'Paid' },
  ]);

  const [uPeriod, setUPeriod] = useState('June 2026 (Updated)');
  const [uPower, setUPower] = useState('');
  const [uPf, setUPf] = useState('0.96');
  const [uBillAmt, setUBillAmt] = useState('');
  const [uDiesel, setUDiesel] = useState('');
  const [uDieselCost, setUDieselCost] = useState('');
  const [uTurbine, setUTurbine] = useState('');
  const [uAlert, setUAlert] = useState(false);

  const handleUtilitySubmit = (e) => {
    e.preventDefault();
    if (!uPower || !uBillAmt || !uDiesel || !uDieselCost || !uTurbine) return;

    const newUtil = {
      period: uPeriod,
      meterId: 'MTR-BOILER-01',
      power: parseFloat(uPower) || 0,
      pf: parseFloat(uPf) || 0.96,
      billAmt: parseFloat(uBillAmt) || 0,
      diesel: parseFloat(uDiesel) || 0,
      dieselCost: parseFloat(uDieselCost) || 0,
      turbine: parseFloat(uTurbine) || 0,
      status: 'Pending Approval'
    };

    setUtilities([newUtil, ...utilities]);
    setUPower('');
    setUBillAmt('');
    setUDiesel('');
    setUDieselCost('');
    setUTurbine('');
    setUAlert(true);
    setTimeout(() => setUAlert(false), 3000);
  };

  // ----------------------------------------------------
  // RENDER TABS LIST
  // ----------------------------------------------------
  const tabConfig = [
    { key: 'spare-parts', label: 'Spare Inventory', icon: Settings },
    { key: 'maintenance', label: 'Machinery Maintenance', icon: Wrench },
    { key: 'transport', label: 'Logistics & Fleet', icon: Truck },
    { key: 'electricity', label: 'Utility Billing', icon: Zap },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Infrastructure & Utilities Hub</h2>
          <p className="text-xs text-slate-500 mt-0.5">Audit grid power consumption, log machinery maintenance, track logistics dispatch, and monitor spare parts.</p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 text-xs">
        {tabConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-5 py-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
                isActive
                  ? 'border-amber-500 text-slate-900 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* TAB A: SPARE INVENTORY */}
      {/* ==================================================================== */}
      {activeTab === 'spare-parts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inventory Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden flex flex-col">
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex justify-between items-center">
                <h3 className="font-extrabold text-xs text-slate-950 uppercase tracking-wide">Mechanical Spare Inventory</h3>
                <span className="text-[10px] bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
                  2 Items Low Stock
                </span>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="px-5 py-3">Part ID</th>
                      <th className="px-5 py-3">Part Name</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3 text-right">Available Stock</th>
                      <th className="px-5 py-3 text-right">Reorder Point</th>
                      <th className="px-5 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {spares.map((part) => (
                      <tr key={part.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3 text-slate-400 font-mono font-semibold">{part.id}</td>
                        <td className="px-5 py-3 text-slate-900 font-bold">{part.name}</td>
                        <td className="px-5 py-3 text-slate-550">{part.category}</td>
                        <td className="px-5 py-3 text-right font-bold text-slate-800">{part.stock} {part.unit}</td>
                        <td className="px-5 py-3 text-right text-slate-450">{part.reorder} {part.unit}</td>
                        <td className="px-5 py-3 text-right">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                            part.status === 'Optimal'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : part.status === 'Low Stock'
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : 'bg-rose-50 text-rose-700 border-rose-100'
                          }`}>
                            {part.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Form & Requisition Panel */}
          <div className="space-y-6">
            {/* Form */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <h3 className="font-extrabold text-xs text-slate-950 uppercase tracking-wide border-b border-slate-100 pb-3 mb-4">
                Reorder Requisition Form
              </h3>
              {spareAlert && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-3.5 rounded text-[11px] mb-4 flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span className="font-semibold">Requisition generated successfully!</span>
                </div>
              )}
              <form onSubmit={handleSpareReorderSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Select Spare Part</label>
                  <select
                    value={sparePartSelect}
                    onChange={(e) => setSparePartSelect(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-slate-800 cursor-pointer"
                  >
                    {spares.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Reorder Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={spareQty}
                    onChange={(e) => setSpareQty(e.target.value)}
                    placeholder="Enter quantity"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Select Preferred Vendor</label>
                  <select
                    value={spareVendor}
                    onChange={(e) => setSpareVendor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-slate-800 cursor-pointer"
                  >
                    <option value="Buhler Service India">Buhler Service India</option>
                    <option value="Harish Engineering Works">Harish Engineering Works</option>
                    <option value="Industrial Spares Corp">Industrial Spares Corp</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded transition-colors shadow-xs cursor-pointer text-center"
                >
                  Generate Purchase Requisition
                </button>
              </form>
            </div>

            {/* Pending Req Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <h3 className="font-extrabold text-xs text-slate-955 uppercase tracking-wide border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
                <span>Recent Requisitions</span>
                <span className="font-mono text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold">PR Log</span>
              </h3>
              <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                {requisitions.map((req) => (
                  <div key={req.id} className="border border-slate-150 rounded p-3 text-xs space-y-1 bg-slate-50/50">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{req.id}</span>
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 border border-amber-100 text-amber-700">
                        {req.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs">{req.partName}</h4>
                    <p className="text-[10px] text-slate-500">Qty: <span className="font-semibold text-slate-700">{req.qty}</span> | Vendor: <span className="font-semibold text-slate-700">{req.vendor}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB B: MACHINERY MAINTENANCE */}
      {/* ==================================================================== */}
      {activeTab === 'maintenance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logs table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden flex flex-col">
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex justify-between items-center text-xs">
                <h3 className="font-extrabold text-xs text-slate-950 uppercase tracking-wide">Servicing Logs & Downtime</h3>
                <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded font-bold font-mono">
                  Next Boiler Audit: 2026-06-20
                </span>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="px-5 py-3">Machine ID</th>
                      <th className="px-5 py-3">Machine Name</th>
                      <th className="px-5 py-3">Task / Type</th>
                      <th className="px-5 py-3">Last Serviced</th>
                      <th className="px-5 py-3">Next Due</th>
                      <th className="px-5 py-3 text-right">Service Cost</th>
                      <th className="px-5 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {maintenanceLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3 text-slate-400 font-mono font-semibold">{log.id}</td>
                        <td className="px-5 py-3 text-slate-900 font-bold">{log.machineName}</td>
                        <td className="px-5 py-3 text-slate-550">
                          <div>
                            <span>{log.type}</span>
                            <span className="block text-[9px] text-slate-400 font-normal truncate max-w-40">{log.vendor}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-slate-500">{log.lastDate}</td>
                        <td className="px-5 py-3 text-slate-500 font-semibold">{log.nextDate}</td>
                        <td className="px-5 py-3 text-right font-bold text-slate-800">₹{log.cost.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                            log.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : log.status === 'Scheduled'
                              ? 'bg-sky-50 text-sky-700 border-sky-100'
                              : 'bg-rose-50 text-rose-700 border-rose-100'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs h-fit">
            <h3 className="font-extrabold text-xs text-slate-950 uppercase tracking-wide border-b border-slate-100 pb-3 mb-4">
              Log Maintenance / Repair
            </h3>
            {mAlert && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-3.5 rounded text-[11px] mb-4 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span className="font-semibold">Maintenance record saved!</span>
              </div>
            )}
            <form onSubmit={handleMaintenanceSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Select Machine</label>
                <select
                  value={mName}
                  onChange={(e) => setMName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="Color Sorter #2">Color Sorter #2</option>
                  <option value="Boiler De-stoner Section">Boiler De-stoner Section</option>
                  <option value="High-Pressure Steam Boiler">High-Pressure Steam Boiler</option>
                  <option value="Pre-cleaner Elevator #1">Pre-cleaner Elevator #1</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Maintenance Type</label>
                <select
                  value={mType}
                  onChange={(e) => setMType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="Routine Servicing">Routine Servicing</option>
                  <option value="Breakdown Repair">Breakdown Repair</option>
                  <option value="Calibration">Calibration</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Service Vendor *</label>
                <input
                  type="text"
                  required
                  placeholder="Vendor name"
                  value={mVendor}
                  onChange={(e) => setMVendor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Labor / Material Cost (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 5000"
                  value={mCost}
                  onChange={(e) => setMCost(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Action Status</label>
                <select
                  value={mStatus}
                  onChange={(e) => setMStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-slate-850 cursor-pointer"
                >
                  <option value="Completed">Completed</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Downtime">Downtime</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded transition-colors shadow-xs cursor-pointer text-center"
              >
                Log Maintenance Event
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB C: LOGISTICS & FREIGHT TRANSPORT */}
      {/* ==================================================================== */}
      {activeTab === 'transport' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dispatch Fleet Log */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden flex flex-col">
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex justify-between items-center text-xs">
                <h3 className="font-extrabold text-xs text-slate-950 uppercase tracking-wide">Transporter Shipments & Freight Logs</h3>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                  {dispatches.length} Cargo Logged
                </span>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="px-5 py-3">Dispatch ID</th>
                      <th className="px-5 py-3">Truck Number</th>
                      <th className="px-5 py-3">Transporter</th>
                      <th className="px-5 py-3">Destination</th>
                      <th className="px-5 py-3 text-center">Bags</th>
                      <th className="px-5 py-3 text-right">Net Weight</th>
                      <th className="px-5 py-3 text-right">Freight Charges</th>
                      <th className="px-5 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {dispatches.map((disp) => (
                      <tr key={disp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3 text-slate-400 font-mono font-semibold">{disp.id}</td>
                        <td className="px-5 py-3 text-slate-900 font-bold font-mono">{disp.truckNo}</td>
                        <td className="px-5 py-3 text-slate-550">{disp.transporter}</td>
                        <td className="px-5 py-3 text-slate-700 font-semibold">{disp.destination}</td>
                        <td className="px-5 py-3 text-center font-mono font-bold text-slate-650">{disp.bags}</td>
                        <td className="px-5 py-3 text-right font-semibold text-slate-800">{disp.weight} t</td>
                        <td className="px-5 py-3 text-right font-mono font-bold text-slate-900">
                          <div>
                            <span>₹{disp.totalBill.toLocaleString()}</span>
                            <span className="block text-[9px] text-slate-400 font-normal">₹{disp.rate}/t</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                            disp.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : disp.status === 'In Transit'
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {disp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs h-fit">
            <h3 className="font-extrabold text-xs text-slate-955 uppercase tracking-wide border-b border-slate-100 pb-3 mb-4">
              Schedule New Dispatch
            </h3>
            {tAlert && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-3.5 rounded text-[11px] mb-4 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span className="font-semibold">Truck scheduled and dispatch gate pass created!</span>
              </div>
            )}
            <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Truck Plate Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KA-19-M-2041"
                  value={tTruck}
                  onChange={(e) => setTTruck(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Transporter Agency</label>
                <select
                  value={tTransporter}
                  onChange={(e) => setTTransporter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="Sri Laxmi Transport">Sri Laxmi Transport</option>
                  <option value="Supreme Logistics LLC">Supreme Logistics LLC</option>
                  <option value="Balaji Roadways Corp">Balaji Roadways Corp</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Destination Port / Yard *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chennai Port"
                  value={tDest}
                  onChange={(e) => setTDest(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Bags Count *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 500"
                    value={tBags}
                    onChange={(e) => setTBags(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Net Weight (Tons) *</label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    min="0.1"
                    placeholder="e.g. 25.0"
                    value={tWeight}
                    onChange={(e) => setTWeight(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Freight Rate (₹/Ton) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 1800"
                  value={tRate}
                  onChange={(e) => setTRate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded transition-colors shadow-xs cursor-pointer text-center"
              >
                Dispatch Truck Cargo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB D: UTILITY BILL ENTRY */}
      {/* ==================================================================== */}
      {activeTab === 'electricity' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bill Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden flex flex-col">
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex justify-between items-center text-xs">
                <h3 className="font-extrabold text-xs text-slate-950 uppercase tracking-wide">Utility Consumption Logs</h3>
                <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded font-bold font-mono">
                  Meter: MTR-BOILER-01
                </span>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="px-5 py-3">Billing Month</th>
                      <th className="px-5 py-3 text-right">Power Consumed</th>
                      <th className="px-5 py-3 text-center">Power Factor</th>
                      <th className="px-5 py-3 text-right">Electricity Bill</th>
                      <th className="px-5 py-3 text-right">Diesel Fuel Used</th>
                      <th className="px-5 py-3 text-right">Fuel Cost</th>
                      <th className="px-5 py-3 text-right">Turbine Gen.</th>
                      <th className="px-5 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {utilities.map((util, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3 text-slate-900 font-bold">{util.period}</td>
                        <td className="px-5 py-3 text-right font-mono font-bold text-slate-800">{util.power.toLocaleString()} kWh</td>
                        <td className="px-5 py-3 text-center font-mono font-semibold text-slate-550">{util.pf}</td>
                        <td className="px-5 py-3 text-right font-mono font-extrabold text-slate-950">₹{util.billAmt.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right font-mono font-bold text-slate-800">{util.diesel.toLocaleString()} L</td>
                        <td className="px-5 py-3 text-right font-mono font-bold text-rose-650">₹{util.dieselCost.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right font-mono font-bold text-emerald-650">{util.turbine.toLocaleString()} kWh</td>
                        <td className="px-5 py-3 text-right">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                            util.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {util.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs h-fit">
            <h3 className="font-extrabold text-xs text-slate-955 uppercase tracking-wide border-b border-slate-100 pb-3 mb-4">
              Log Utility Readings
            </h3>
            {uAlert && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-3.5 rounded text-[11px] mb-4 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span className="font-semibold">Utility readings saved! Power factor audits processed.</span>
              </div>
            )}
            <form onSubmit={handleUtilitySubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Billing Month/Period *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. June 2026"
                  value={uPeriod}
                  onChange={(e) => setUPeriod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Grid Power (kWh) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 85000"
                    value={uPower}
                    onChange={(e) => setUPower(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Power Factor *</label>
                  <input
                    type="text"
                    required
                    placeholder="0.96"
                    value={uPf}
                    onChange={(e) => setUPf(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-slate-850"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Electricity Bill (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 760000"
                  value={uBillAmt}
                  onChange={(e) => setUBillAmt(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Gen-set Diesel (L) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 2400"
                    value={uDiesel}
                    onChange={(e) => setUDiesel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Diesel Fuel Cost (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 216000"
                    value={uDieselCost}
                    onChange={(e) => setUDieselCost(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Turbine Output (kWh) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 12000"
                  value={uTurbine}
                  onChange={(e) => setUTurbine(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-850"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded transition-colors shadow-xs cursor-pointer text-center"
              >
                Log Utility Ledger
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
