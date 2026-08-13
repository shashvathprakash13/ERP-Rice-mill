import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Scale, 
  TrendingUp, 
  IndianRupee, 
  Users, 
  Clock, 
  CheckCircle, 
  Activity, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export default function Dashboard() {
  const { activeWarehouseId, dateRange, warehouses, dashboardData } = useApp();
  const selectedWarehouse = warehouses.find(w => w.id === activeWarehouseId)?.name || activeWarehouseId;

  // Mock data for ongoing milling runs
  const millingBatches = [
    { id: 'B-26-089', variety: 'Sona Masuri', weight: '250 Qt', moisture: '13.2%', status: 'Milling' },
    { id: 'B-26-090', variety: 'Jyothi Rice', weight: '180 Qt', moisture: '14.1%', status: 'Drying' },
    { id: 'B-26-091', variety: 'Basmati Rice', weight: '320 Qt', moisture: '12.8%', status: 'In Silo' },
    { id: 'B-26-088', variety: 'Sona Masuri', weight: '220 Qt', moisture: '12.1%', status: 'Packaged' },
    { id: 'B-26-087', variety: 'Jeera Rice', weight: '150 Qt', moisture: '13.5%', status: 'Milling' },
  ];

  // Mock data for recent incoming paddy freight vehicles
  const incomingVehicles = [
    { vehicleNo: 'KA-34-F-8920', supplierType: 'Farmer', weight: '12.4 Tons', time: '19:12' },
    { vehicleNo: 'AP-21-Y-4530', supplierType: 'Dealer', weight: '18.2 Tons', time: '18:45' },
    { vehicleNo: 'OD-15-R-7798', supplierType: 'Paik', weight: '8.5 Tons', time: '18:10' },
    { vehicleNo: 'MH-12-Q-1240', supplierType: 'Farmer', weight: '14.1 Tons', time: '17:30' },
    { vehicleNo: 'KA-09-E-5566', supplierType: 'Farmer', weight: '11.8 Tons', time: '16:50' },
  ];

  // Color mappings for milling status badges
  const statusColors = {
    'In Silo': 'bg-slate-100 text-slate-700 border-slate-200',
    'Drying': 'bg-sky-50 text-sky-700 border-sky-100',
    'Milling': 'bg-amber-50 text-amber-700 border-amber-100',
    'Packaged': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Dashboard Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time overview of current paddy intake, active milling runs, and warehouse capacity.</p>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Scope: <span className="text-slate-800 font-semibold">{selectedWarehouse}</span>
        </div>
      </div>
      
      {/* real rice mill KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Total Paddy Intake */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Paddy Intake</span>
            <div className="p-1.5 bg-slate-100 rounded text-slate-700">
              <Scale className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">{dashboardData?.totalStock ?? 0} Items</div>
            <div className="text-[11px] text-slate-500 mt-1">Current inventory stock</div>
          </div>
        </div>

        {/* KPI 2: Milling Output Yield */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Milling Output Yield</span>
            <div className="p-1.5 bg-slate-100 rounded text-slate-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">{dashboardData?.todaysPurchases?.count ?? 0}</div>
            <div className="text-[11px] text-slate-500 mt-1">Today&apos;s purchase records</div>
          </div>
        </div>

        {/* KPI 3: Outstanding Payables */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outstanding Payables</span>
            <div className="p-1.5 bg-slate-100 rounded text-slate-700">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">₹{dashboardData?.pendingPayments?.amount ?? 0}</div>
            <div className="text-[11px] text-slate-500 mt-1">Pending payments</div>
          </div>
        </div>

        {/* KPI 4: Active Mill Workforce */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Mill Workforce</span>
            <div className="p-1.5 bg-slate-100 rounded text-slate-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">{dashboardData?.totalWorkers ?? 0} Workers</div>
            <div className="text-[11px] text-slate-500 mt-1">Registered workforce</div>
          </div>
        </div>
      </div>

      {/* Split Row Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left Column (60% width): Active Production Milling Batches */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col">
          <div className="border-b border-slate-200 px-5 py-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm">Active Production Milling Batches</h3>
            <span className="flex items-center text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">
              Live Runs
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="px-5 py-3">Batch ID</th>
                  <th className="px-5 py-3">Paddy Variety</th>
                  <th className="px-5 py-3">Input Weight</th>
                  <th className="px-5 py-3">Moisture</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {millingBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-900">{batch.id}</td>
                    <td className="px-5 py-3 text-slate-600">{batch.variety}</td>
                    <td className="px-5 py-3 text-slate-700 font-medium">{batch.weight}</td>
                    <td className="px-5 py-3 text-slate-600 font-mono">{batch.moisture}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[batch.status] || 'bg-slate-100 text-slate-800'}`}>
                        {batch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (40% width): Recent Paddy Freight Intake */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col">
          <div className="border-b border-slate-200 px-5 py-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm">Recent Paddy Freight Intake</h3>
            <span className="flex items-center text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">
              Weighbridge
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {incomingVehicles.map((vehicle, index) => (
                <div key={index} className="flex justify-between items-center text-xs pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 font-bold text-[10px]">
                      {vehicle.time}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{vehicle.vehicleNo}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Supplier: {vehicle.supplierType}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-700">{vehicle.weight}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Net Freight Weight</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
