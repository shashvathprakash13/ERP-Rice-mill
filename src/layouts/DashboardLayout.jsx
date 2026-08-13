import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 font-sans text-slate-700">
      {/* Fixed Topbar */}
      <Topbar />

      {/* Main Body container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Collapsible Left Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Scrollable Content Canvas with consistent internal padding */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-100/30 custom-scrollbar relative">
          {/* Immersive background photo wrapper */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute inset-0 bg-cover bg-center filter blur-[20px] scale-105 opacity-[0.16]"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 via-transparent to-slate-800/10"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
