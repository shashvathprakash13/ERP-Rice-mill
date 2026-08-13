import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Flame,
  Warehouse as WarehouseIcon,
  FileSpreadsheet,
  Users,
  Coins,
  Receipt,
  BookOpen,
  UserCheck,
  Calendar,
  DollarSign,
  Settings,
  Wrench,
  Truck,
  Zap,
  User,
  ChevronDown,
  ChevronRight,
  Menu,
  ChevronLeft
} from 'lucide-react';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  // Category expanded states
  const [expandedCategories, setExpandedCategories] = useState({
    core: true,
    commercial: true,
    financial: true,
    hr: false,
    infra: false,
    settings: true,
  });

  const toggleCategory = (cat) => {
    if (isCollapsed) {
      // If sidebar is collapsed, clicking expands the sidebar first
      setIsCollapsed(false);
      setExpandedCategories(prev => ({ ...prev, [cat]: true }));
      return;
    }
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const navItems = {
    core: {
      label: 'Core Operations',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Paddy Entry', path: '/paddy-entry', icon: ClipboardList },
        { name: 'Production', path: '/production', icon: Flame },
        { name: 'Warehouse', path: '/warehouse', icon: WarehouseIcon },
        { name: 'Reports', path: '/reports', icon: FileSpreadsheet },
      ]
    },
    commercial: {
      label: 'Commercial Hub',
      items: [
        { name: 'Supplier Page', path: '/supplier', icon: Users },
        { name: 'Buyer Page', path: '/buyer', icon: Coins },
      ]
    },
    financial: {
      label: 'Financial Controls',
      items: [
        { name: 'Payment Page', path: '/payment', icon: Receipt },
        { name: 'Ledger Page', path: '/ledger', icon: BookOpen },
      ]
    },
    hr: {
      label: 'HR & Payroll',
      items: [
        { name: 'Worker Page', path: '/worker', icon: UserCheck },
        { name: 'Attendance Page', path: '/attendance', icon: Calendar },
        { name: 'Salary Page', path: '/salary', icon: DollarSign },
      ]
    },
    infra: {
      label: 'Infrastructure & Utilities',
      items: [
        { name: 'Spare Parts Page', path: '/spare-parts', icon: Settings },
        { name: 'Maintenance Page', path: '/maintenance', icon: Wrench },
        { name: 'Transport Page', path: '/transport', icon: Truck },
        { name: 'Electricity Page', path: '/electricity', icon: Zap },
      ]
    },
    settings: {
      label: 'Settings',
      items: [
        { name: 'Profile Page', path: '/profile', icon: User },
      ]
    }
  };

  return (
    <div 
      className={`bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 text-slate-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } shrink-0 h-[calc(100vh-3.5rem)] select-none`}
    >
      {/* Sidebar Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-3 custom-scrollbar">
        {Object.entries(navItems).map(([catKey, cat]) => {
          const isExpanded = expandedCategories[catKey];
          return (
            <div key={catKey} className="space-y-1">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(catKey)}
                className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-300 py-1.5 px-2 rounded hover:bg-slate-800/40 transition-colors focus:outline-none"
              >
                <span className="truncate">{isCollapsed ? '...' : cat.label}</span>
                {!isCollapsed && (
                  isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
                )}
              </button>

              {/* Category Items */}
              {((isExpanded && !isCollapsed) || isCollapsed) && (
                <div className="space-y-0.5">
                  {cat.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-2.5 py-2 rounded-md transition-all text-xs font-medium ${
                            isActive
                              ? 'bg-amber-500 text-slate-950 shadow-xs font-semibold'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                          }`
                        }
                        title={item.name}
                      >
                        <Icon className="h-4.5 w-4.5 shrink-0" />
                        {!isCollapsed && <span className="truncate">{item.name}</span>}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="border-t border-slate-800 p-2.5 flex justify-end shrink-0">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4.5 w-4.5" /> : <ChevronLeft className="h-4.5 w-4.5" />}
        </button>
      </div>
    </div>
  );
}
