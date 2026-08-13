import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { apiRequest } from '../services/api';

export default function Buyer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [buyers, setBuyers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        setIsLoading(true);
        const payload = await apiRequest('/buyers');
        const data = payload?.buyers || [];
        setBuyers(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Unable to fetch buyers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  const filteredBuyers = buyers.filter((buyer) => {
    const haystack = `${buyer.buyerName || buyer.name || ''} ${buyer.address || ''}`.toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  });

  const getCreditLimitBadge = (status) => {
    if (status === 'Active') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (status === 'Near Limit') return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-red-50 text-red-700 border-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Manage Buyers</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage wholesale clients, export contracts, shipment packaging criteria, and credit lines.</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex justify-between items-center bg-white/70 border border-slate-200/50 rounded-lg p-3 shadow-xs">
        <div className="relative w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company or variety..."
            className="w-full bg-slate-50 border border-slate-200 rounded pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-medium text-slate-800"
          />
        </div>
        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
          Total Buyers: {buyers.length}
        </div>
      </div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="px-5 py-3">Buyer ID</th>
              <th className="px-5 py-3">Company Name</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Address</th>
              <th className="px-5 py-3">Balance</th>
              <th className="px-5 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-5 py-8 text-center text-slate-400 font-medium bg-slate-50/20">Loading buyers...</td>
              </tr>
            ) : filteredBuyers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-5 py-8 text-center text-slate-400 font-medium bg-slate-50/20">No matching buyers found.</td>
              </tr>
            ) : (
              filteredBuyers.map((buyer) => (
                <tr key={buyer._id || buyer.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-500">{buyer._id || buyer.id}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">{buyer.buyerName || buyer.name}</td>
                  <td className="px-5 py-3.5 text-slate-500 font-medium">{buyer.phone}</td>
                  <td className="px-5 py-3.5 text-slate-650 font-medium">{buyer.address}</td>
                  <td className="px-5 py-3.5 text-slate-900 font-semibold font-mono">₹{Number(buyer.balance || 0).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCreditLimitBadge('Active')}`}>
                      Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
