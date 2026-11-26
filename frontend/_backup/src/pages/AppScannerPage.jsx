import React, { useState } from 'react';
import { LayoutGrid, RefreshCw, CheckCircle2, AlertTriangle, ExternalLink, Trash2 } from 'lucide-react';

export default function AppScannerPage() {
  const [apps, setApps] = useState([
    { id: 1, name: 'Google Chrome', publisher: 'Google LLC', version: '131.0.6778.86', size: '380 MB', status: 'Up to Date', safe: true },
    { id: 2, name: 'Node.js JavaScript Runtime', publisher: 'OpenJS Foundation', version: '24.17.0', size: '145 MB', status: 'Up to Date', safe: true },
    { id: 3, name: 'PostgreSQL Database Server', publisher: 'PostgreSQL Global Dev Group', version: '17.0.10', size: '420 MB', status: 'Up to Date', safe: true },
    { id: 4, name: '7-Zip File Archiver', publisher: 'Igor Pavlov', version: '23.01', size: '5.2 MB', status: 'Update Available (v24.08)', safe: false },
    { id: 5, name: 'Git for Windows', publisher: 'The Git Development Community', version: '2.54.0', size: '320 MB', status: 'Up to Date', safe: true },
    { id: 6, name: 'Docker Desktop Engine', publisher: 'Docker Inc.', version: '4.30.0', size: '1.8 GB', status: 'Service Standby', safe: true },
  ]);

  const updateApp = (id) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: 'Up to Date', safe: true } : a));
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 max-w-5xl">
      <div className="pb-4 border-b border-[#14234b]">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <LayoutGrid className="w-6 h-6 text-blue-400" />
          Installed Application & Software Scanner
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Catalog installed endpoint software, identify orphaned registries, check cryptographic signatures, and update apps.
        </p>
      </div>

      <div className="bg-[#0c142b] rounded-3xl border border-[#162752] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080e22] border-b border-[#14234b] text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Application</th>
                <th className="px-6 py-4">Publisher</th>
                <th className="px-6 py-4">Version</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Security Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132042]">
              {apps.map(app => (
                <tr key={app.id} className="hover:bg-[#0f1a3a] transition">
                  <td className="px-6 py-4 font-bold text-white">
                    {app.name}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {app.publisher}
                  </td>
                  <td className="px-6 py-4 font-mono text-cyan-400">
                    {app.version}
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono">
                    {app.size}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      app.safe
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-950/40 text-amber-400 border border-amber-500/30'
                    }`}>
                      {app.safe ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!app.safe ? (
                      <button
                        onClick={() => updateApp(app.id)}
                        className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold text-[11px] transition"
                      >
                        Update
                      </button>
                    ) : (
                      <button
                        onClick={() => alert(`Inspecting integrity for ${app.name}`)}
                        className="p-1.5 text-slate-500 hover:text-slate-300 transition"
                        title="Inspect Package"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
