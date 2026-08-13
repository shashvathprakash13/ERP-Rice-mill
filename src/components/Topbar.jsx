import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bell, ShieldAlert, Cpu, ArrowRight, User } from 'lucide-react';

export default function Topbar() {
  const { activeWarehouseId, setActiveWarehouseId, warehouses } = useApp();

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between px-6 shrink-0 sticky top-0 z-40 shadow-md">
      {/* Left section: Branding & System status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-500 text-slate-950 p-1.5 rounded font-black tracking-tight text-xs flex items-center justify-center">
            GRR
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-100">Golden Rice Rise ERP</span>
        </div>
        
        {/* Divider */}
        <div className="h-4 w-px bg-slate-800"></div>

        {/* Dynamic System Status Indicator */}
        <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2 py-1 rounded-sm border border-slate-700/60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-semibold tracking-wide uppercase text-slate-300">
            Active Crushing Session: 2026
          </span>
        </div>
      </div>

      {/* Center section: Global Warehouse/Silo Filter Dropdown */}
      <div className="flex items-center w-72">
        <select
          value={activeWarehouseId}
          onChange={(e) => setActiveWarehouseId(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium cursor-pointer"
        >
          {warehouses.map((w) => (
            <option key={w.id} value={w.id} className="bg-slate-800 text-slate-200">
              {w.name}
            </option>
          ))}
        </select>
      </div>

      {/* Right section: Notifications & Profile Avatar badge */}
      <div className="flex items-center space-x-3.5">
        {/* Notifications Icon with active badge */}
        <button 
          className="relative text-slate-400 hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-850 transition-colors focus:outline-none"
          title="System Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        </button>

        {/* Profile Avatar badge linking to Profile settings */}
        <Link 
          to="/profile" 
          className="flex items-center space-x-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 rounded-full pl-2.5 pr-3 py-1 transition-all group focus:outline-none"
          title="Profile Settings"
        >
          <div className="h-5.5 w-5.5 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 group-hover:bg-slate-650 transition-colors">
            <User className="h-3.5 w-3.5" />
          </div>
          <div className="text-left leading-none">
            <div className="text-[10px] font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
              Super Admin
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5 font-medium">
              Mill Manager
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
