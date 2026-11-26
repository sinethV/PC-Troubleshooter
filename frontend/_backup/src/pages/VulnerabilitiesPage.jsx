import React, { useState } from 'react';
import { ShieldAlert, RefreshCw, CheckCircle2, Flame, AlertTriangle, ArrowRight, Download } from 'lucide-react';

export default function VulnerabilitiesPage() {
  const [patchingAll, setPatchingAll] = useState(false);
  const [patched, setPatched] = useState(false);

  const [vulnerabilities, setVulnerabilities] = useState([
    {
      id: 1,
      title: 'Google Chrome V8 Engine Zero-Day Flaw',
      cve: 'CVE-2024-4671',
      severity: 'CRITICAL',
      installed: 'v122.0.6261.95',
      available: 'v131.0.6778.86',
      impact: 'Arbitrary remote code execution via malicious web worker',
      fixed: false
    },
    {
      id: 2,
      title: 'Windows 11 Servicing Stack Cumulative Security Patch',
      cve: 'KB5034441',
      severity: 'HIGH',
      installed: 'Build 22631.3007',
      available: 'Build 22631.4460',
      impact: 'BitLocker recovery bypass vulnerability',
      fixed: false
    },
    {
      id: 3,
      title: '7-Zip Buffer Overflow Vulnerability',
      cve: 'CVE-2023-40481',
      severity: 'MEDIUM',
      installed: 'v23.01',
      available: 'v24.08',
      impact: 'Heap buffer overflow during archive decompression',
      fixed: false
    },
    {
      id: 4,
      title: 'OpenSSL Crypto Library Update',
      cve: 'CVE-2024-0727',
      severity: 'MEDIUM',
      installed: 'v3.0.12',
      available: 'v3.0.15',
      impact: 'Denial of Service while parsing PKCS7 structure',
      fixed: false
    }
  ]);

  const patchSingle = (id) => {
    setVulnerabilities(prev => prev.map(v => v.id === id ? { ...v, fixed: true } : v));
  };

  const handlePatchAll = () => {
    setPatchingAll(true);
    setTimeout(() => {
      setPatchingAll(false);
      setPatched(true);
      setVulnerabilities(prev => prev.map(v => ({ ...v, fixed: true })));
    }, 1500);
  };

  const pendingCount = vulnerabilities.filter(v => !v.fixed).length;

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#14234b]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            Vulnerability & Patch Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Analyze known CVE database advisories, detect unpatched software, and stage security remediations.
          </p>
        </div>

        {pendingCount > 0 ? (
          <button
            onClick={handlePatchAll}
            disabled={patchingAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 transition disabled:opacity-50"
          >
            {patchingAll ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Download className="w-4 h-4" />}
            {patchingAll ? 'Deploying Patches...' : `Apply All Patches (${pendingCount})`}
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" /> All Vulnerabilities Patched
          </div>
        )}
      </div>

      {/* Vulnerabilities List */}
      <div className="space-y-3">
        {vulnerabilities.map(v => (
          <div
            key={v.id}
            className={`p-5 rounded-2xl cyber-card border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              v.fixed ? 'border-emerald-500/30 bg-[#091522]' : 'border-[#162752]'
            }`}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                  v.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                  v.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                  'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {v.severity}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">{v.cve}</span>
                {v.fixed && (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Remediated
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white">{v.title}</h3>
              <p className="text-xs text-slate-400">{v.impact}</p>
              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1 font-mono">
                <span>Installed: <strong className="text-slate-300">{v.installed}</strong></span>
                <span>Available: <strong className="text-cyan-400">{v.available}</strong></span>
              </div>
            </div>

            {!v.fixed ? (
              <button
                onClick={() => patchSingle(v.id)}
                className="px-4 py-2 rounded-xl bg-[#132247] hover:bg-[#1a3168] text-cyan-300 hover:text-white border border-[#1d3772] text-xs font-bold transition shrink-0"
              >
                Apply Patch
              </button>
            ) : (
              <div className="text-xs font-semibold text-emerald-400 shrink-0">
                Safe & Updated
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
