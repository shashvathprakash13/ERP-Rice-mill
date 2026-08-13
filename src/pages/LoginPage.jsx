import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, User, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, authError } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(username, password);
    setIsLoading(false);
    if (!success) {
      setError(authError || 'Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 font-sans antialiased relative overflow-hidden">
      {/* Structural background glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-900/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md z-10">
        {/* Logo and Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-amber-500 text-slate-950 px-3 py-2 rounded font-black tracking-tight text-lg mb-3 shadow-md">
            GRR
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Golden Rice Rise</h1>
          <p className="text-xs text-slate-400 mt-1">Enterprise Rice Mill Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-100">Sign In</h2>
            <p className="text-xs text-slate-400">Enter your credentials to access the mill management shell.</p>
          </div>

          {(error || authError) && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-xs flex items-center space-x-2.5">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span className="font-medium">{error || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 rounded pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 rounded pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-950 py-2.5 px-4 rounded text-xs font-bold transition-all shadow-md focus:outline-none flex items-center justify-center"
            >
              {isLoading ? 'Verifying Account...' : 'Access Dashboard'}
            </button>
          </form>

          {/* Quick Help Tip */}
          <div className="text-center pt-2">
            <span className="text-[10px] text-slate-500 italic">
              Default access credentials: <span className="font-semibold text-slate-400">admin</span> / <span className="font-semibold text-slate-400">admin</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
