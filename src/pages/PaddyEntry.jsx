import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Truck, Scale, ClipboardCheck, Database, FileText, CheckCircle2 } from 'lucide-react';

export default function PaddyEntry() {
  const { activeWarehouseId } = useApp();

  // Shipments log local state
  const [shipments, setShipments] = useState([
    { id: 'GP-26-412', vehicleNo: 'KA-34-F-8920', supplier: 'Ramesh Kumar (Farmer)', variety: 'Sona Masuri', moisture: '13.2%', gross: '28.4 t', tare: '16.0 t', net: '12.4 t', silo: 'Silo B' },
    { id: 'GP-26-411', vehicleNo: 'AP-21-Y-4530', supplier: 'Sri Balaji Traders (Dealer)', variety: 'Jyothi Rice', moisture: '14.1%', gross: '34.2 t', tare: '16.0 t', net: '18.2 t', silo: 'Godown 1' },
    { id: 'GP-26-410', vehicleNo: 'OD-15-R-7798', supplier: 'Siva Prasad (Paik)', variety: 'Basmati Rice', moisture: '12.8%', gross: '24.5 t', tare: '16.0 t', net: '8.5 t', silo: 'Silo A' },
    { id: 'GP-26-409', vehicleNo: 'MH-12-Q-1240', supplier: 'Raju Gowda (Farmer)', variety: 'Sona Masuri', moisture: '14.1%', gross: '30.1 t', tare: '16.0 t', net: '14.1 t', silo: 'Silo B' },
  ]);

  // Form states
  const [vehicleNo, setVehicleNo] = useState('');
  const [supplierType, setSupplierType] = useState('Farmer');
  const [supplierName, setSupplierName] = useState('');
  const [paddyVariety, setPaddyVariety] = useState('Sona Masuri');
  const [moisture, setMoisture] = useState('');
  const [grossWeight, setGrossWeight] = useState('');
  const [tareWeight, setTareWeight] = useState('16.0'); // Standard average truck tare weight
  const [netWeight, setNetWeight] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [storageDestination, setStorageDestination] = useState('Silo B');

  // Dynamic Net Weight Calculation
  useEffect(() => {
    const gross = parseFloat(grossWeight) || 0;
    const tare = parseFloat(tareWeight) || 0;
    const computedNet = Math.max(0, gross - tare);
    setNetWeight(parseFloat(computedNet.toFixed(2)));
  }, [grossWeight, tareWeight]);

  // Supplier options depending on selected type
  const mockSuppliers = {
    Farmer: ['Ramesh Kumar', 'Raju Gowda', 'Haran Singh', 'Chandra Shekar'],
    Paik: ['Siva Prasad', 'Gopal Das', 'Narayana Swamy'],
    'Dealer/Businessman': ['Sri Balaji Traders', 'Venkateshwara Grain Millers', 'Reliance Agri Markets'],
  };

  // Auto-set supplier name when type changes
  useEffect(() => {
    const list = mockSuppliers[supplierType] || [];
    if (list.length > 0) {
      setSupplierName(list[0]);
    }
  }, [supplierType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (netWeight <= 0) {
      alert('Net Weight must be positive. Gross Weight must exceed Tare Weight.');
      return;
    }

    const silo = storageDestination;

    const newGatePassId = `GP-26-${Math.floor(413 + Math.random() * 100)}`;
    const newEntry = {
      id: newGatePassId,
      vehicleNo: vehicleNo.toUpperCase(),
      supplier: `${supplierName} (${supplierType === 'Dealer/Businessman' ? 'Dealer' : supplierType})`,
      variety: paddyVariety,
      moisture: `${moisture}%`,
      gross: `${grossWeight} t`,
      tare: `${tareWeight} t`,
      net: `${netWeight} t`,
      silo: silo,
    };

    setShipments([newEntry, ...shipments]);

    // Reset Form
    setVehicleNo('');
    setMoisture('');
    setGrossWeight('');
    setSubmitSuccess(true);

    // Hide success alert after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Paddy Weighbridge Entry</h2>
          <p className="text-xs text-slate-500 mt-0.5">Log gross and tare weights for incoming vehicles, run moisture checks, and assign storage silos.</p>
        </div>
      </div>

      {submitSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-3.5 rounded text-xs flex items-center space-x-2.5">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span className="font-semibold">Gate Pass submitted successfully! Auto-allocated to warehouse storage bay.</span>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Intake Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3.5 mb-4">
            <Scale className="h-4.5 w-4.5 text-slate-500" />
            <h3 className="font-semibold text-slate-900 text-sm">Incoming Weighbridge Scale</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Vehicle Number */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Vehicle Number</label>
              <input
                type="text"
                required
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                placeholder="e.g. KA-34-F-8920"
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all text-xs font-semibold text-slate-800"
              />
            </div>

            {/* Supplier Type & Supplier Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Supplier Type</label>
                <select
                  value={supplierType}
                  onChange={(e) => setSupplierType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-800 font-medium"
                >
                  <option value="Farmer">Farmer</option>
                  <option value="Paik">Paik (Middleman)</option>
                  <option value="Dealer/Businessman">Dealer/Businessman</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Supplier Name</label>
                <select
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-800 font-medium"
                >
                  {(mockSuppliers[supplierType] || []).map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Paddy Variety, Storage Destination & Moisture */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Paddy Variety</label>
                <select
                  value={paddyVariety}
                  onChange={(e) => setPaddyVariety(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-800 font-medium"
                >
                  <option value="Sona Masuri">Sona Masuri</option>
                  <option value="Jyothi">Jyothi Rice</option>
                  <option value="Basmati">Basmati (Premium)</option>
                  <option value="Jeera Rice">Jeera Rice</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Storage Destination</label>
                <select
                  value={storageDestination}
                  onChange={(e) => setStorageDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-800 font-medium cursor-pointer"
                >
                  <option value="Silo A">Silo A</option>
                  <option value="Silo B">Silo B</option>
                  <option value="Godown 1">Godown 1</option>
                  <option value="Godown 2">Godown 2</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Moisture %</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={moisture}
                  onChange={(e) => setMoisture(e.target.value)}
                  placeholder="e.g. 14.2"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs font-semibold text-slate-850"
                />
              </div>
            </div>

            {/* Scale Weights */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Gross (Tons)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={grossWeight}
                  onChange={(e) => setGrossWeight(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs font-semibold text-slate-850"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Tare (Tons)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={tareWeight}
                  onChange={(e) => setTareWeight(e.target.value)}
                  placeholder="16.0"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs font-semibold text-slate-850"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-amber-600 uppercase tracking-wider text-[10px]">Net (Tons)</label>
                <div className="w-full bg-slate-100 border border-slate-200 rounded px-2.5 py-1.5 text-xs font-bold text-slate-800 flex items-center justify-center">
                  {netWeight} t
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded font-bold transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer mt-4"
            >
              <ClipboardCheck className="h-4.5 w-4.5" />
              <span>Submit Gate Pass</span>
            </button>
          </form>
        </div>

        {/* Right Column: Historical Logs (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3.5 mb-4 justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="h-4.5 w-4.5 text-slate-500" />
              <h3 className="font-semibold text-slate-900 text-sm">Today's Arrived Shipments Log</h3>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">
              {shipments.length} logged
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="px-4 py-2.5">Pass ID</th>
                  <th className="px-4 py-2.5">Vehicle</th>
                  <th className="px-4 py-2.5">Supplier</th>
                  <th className="px-4 py-2.5">Paddy Variety</th>
                  <th className="px-4 py-2.5">Moisture</th>
                  <th className="px-4 py-2.5">Net Wt</th>
                  <th className="px-4 py-2.5 text-right">Silo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shipments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-slate-500">{item.id}</td>
                    <td className="px-4 py-2.5 font-semibold text-slate-900">{item.vehicleNo}</td>
                    <td className="px-4 py-2.5 text-slate-500 truncate max-w-[130px]" title={item.supplier}>{item.supplier}</td>
                    <td className="px-4 py-2.5 text-slate-600 font-medium">{item.variety}</td>
                    <td className="px-4 py-2.5 text-slate-500 font-mono">{item.moisture}</td>
                    <td className="px-4 py-2.5 text-slate-900 font-bold">{item.net}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold">
                        <Database className="h-3 w-3 text-slate-400 shrink-0" />
                        <span>{item.silo}</span>
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
