import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, Shield, Database, Save, Bell, Check, Loader2 } from 'lucide-react';

export default function Profile() {
  const { logout } = useApp();

  // Form edit states
  const [email, setEmail] = useState('manager@goldenricerise.com');
  const [password, setPassword] = useState('••••••••••••');
  
  // Notification states
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  // Simulated backup state
  const [backupState, setBackupState] = useState('idle'); // idle | backing_up | completed
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  const handleTriggerBackup = () => {
    setBackupState('backing_up');
    setTimeout(() => {
      setBackupState('completed');
      alert('System backup file generated: golden_rice_erp_db_backup_' + new Date().toISOString().split('T')[0] + '.sql\nDownloaded to local downloads.');
      setTimeout(() => {
        setBackupState('idle');
      }, 2000);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">System Settings & Profile</h2>
          <p className="text-xs text-slate-500 mt-0.5">Edit credentials, configure automated backup tasks, adjust alerts, and audit security tokens.</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-3.5 rounded text-xs flex items-center space-x-2.5">
          <Check className="h-4.5 w-4.5 shrink-0" />
          <span className="font-semibold">Security configuration and user settings saved successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Super Admin Identity</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Access Scope: Full Read-Write Owner</p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="flex border-b border-slate-100 pb-3">
                <span className="w-32 text-slate-400 font-medium">User Name</span>
                <span className="text-slate-800 font-bold">Somanjali Singh</span>
              </div>
              
              <div className="flex border-b border-slate-100 pb-3">
                <span className="w-32 text-slate-400 font-medium">Designated Role</span>
                <span className="text-slate-800 font-semibold">Super Admin / Mill Manager</span>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Security Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded transition-colors shadow-xs cursor-pointer text-xs"
              >
                <Save className="h-4 w-4" />
                <span>Save Credentials</span>
              </button>
            </form>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-150 flex justify-end">
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded text-xs transition-colors shadow-xs cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out of System</span>
            </button>
          </div>
        </div>

        {/* Configurations Card */}
        <div className="space-y-6">
          {/* Settings panel */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs text-xs space-y-5">
            <h3 className="font-extrabold text-xs text-slate-955 uppercase tracking-wide border-b border-slate-100 pb-3 flex items-center">
              <Bell className="h-4 w-4 mr-2 text-slate-450" />
              System Alert Preferences
            </h3>
            
            <div className="space-y-4">
              {/* Toggle 1 */}
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">Email Notifications</h4>
                  <p className="text-[10px] text-slate-450">Alerts on low stock spares, pending dispatches, or buyer balance changes.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                />
              </div>

              {/* Toggle 2 */}
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">SMS / WhatsApp Gateways</h4>
                  <p className="text-[10px] text-slate-450">Daily dispatch gate pass summaries and employee attendance alerts.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifySMS}
                  onChange={(e) => setNotifySMS(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                />
              </div>

              {/* Toggle 3 */}
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">Automated SQL Database Backup</h4>
                  <p className="text-[10px] text-slate-450">Daily cron backup schedules triggered at 11:30 PM (saved to cloud storage).</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoBackup}
                  onChange={(e) => setAutoBackup(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Backup panel */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs text-xs space-y-4">
            <h3 className="font-extrabold text-xs text-slate-955 uppercase tracking-wide border-b border-slate-100 pb-3 flex items-center">
              <Database className="h-4 w-4 mr-2 text-slate-450" />
              Backup & Database Utility
            </h3>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Manually compile the system registry, transaction ledger tables, paddy gate passes, worker attendance log, and download an encrypted SQL backup database file.
            </p>

            <button
              onClick={handleTriggerBackup}
              disabled={backupState === 'backing_up'}
              className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-bold py-2.5 px-4 rounded transition-colors shadow-xs cursor-pointer text-xs w-full"
            >
              {backupState === 'backing_up' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                  <span>Packaging SQL Dump...</span>
                </>
              ) : backupState === 'completed' ? (
                <>
                  <Check className="h-4 w-4 text-emerald-450" />
                  <span>Backup Created!</span>
                </>
              ) : (
                <span>Trigger Manual System Backup</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
