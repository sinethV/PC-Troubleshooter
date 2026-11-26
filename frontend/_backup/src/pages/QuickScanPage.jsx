import React, { useState } from 'react';
import { Search, ShieldCheck, Flame, RefreshCw, FolderSearch, CheckCircle2, Play, AlertTriangle } from 'lucide-react';
import LiveScannerModal from '../components/dashboard/LiveScannerModal';

export default function QuickScanPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [scanType, setScanType] = useState('quick_scan');
  const [lastScanResult, setLastScanResult] = useState(null);

  const startScan = (type) => {
    setScanType(type);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 max-w-5xl">
      <div className="pb-4 border-b border-[#14234b]">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Search className="w-6 h-6 text-cyan-400" />
          Threat & Antivirus Scanning Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Select a diagnostic scan profile to examine memory, registry keys, drivers, and file systems.
        </p>
      </div>

      {/* 3 Main Scan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Quick Scan Card */}
        <div className="p-6 rounded-3xl cyber-card border border-[#162752] flex flex-col justify-between space-y-4 hover:border-cyan-500/50 transition">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-neon-cyan">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Quick Scan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scans active memory, running background services, startup registry entries, and high-risk system paths. Takes ~1-2 minutes.
            </p>
          </div>
          <button
            onClick={() => startScan('quick_scan')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/25 transition flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5" /> Start Quick Scan
          </button>
        </div>

        {/* Full Deep Scan Card */}
        <div className="p-6 rounded-3xl cyber-card border border-[#162752] flex flex-col justify-between space-y-4 hover:border-purple-500/50 transition">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-neon-purple">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Full Deep Scan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exhaustively examines every file, boot sector, DLL library, and archive on all mounted storage volumes. Takes ~10-15 minutes.
            </p>
          </div>
          <button
            onClick={() => startScan('malware_removal')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5" /> Start Deep Scan
          </button>
        </div>

        {/* Custom Folder Scan Card */}
        <div className="p-6 rounded-3xl cyber-card border border-[#162752] flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-neon-emerald">
              <FolderSearch className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Custom Target Scan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Target a specific external flash drive, downloads folder, or network directory for isolated forensic quarantine.
            </p>
          </div>
          <button
            onClick={() => startScan('vulnerability_check')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/25 transition flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5" /> Scan Target Folder
          </button>
        </div>

      </div>

      {/* Last Scan Status Banner */}
      {lastScanResult && (
        <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="font-bold text-white">{lastScanResult.title} Completed</p>
              <p className="text-[11px] text-slate-300">{lastScanResult.fixedCount} threats neutralized and quarantined.</p>
            </div>
          </div>
          <span className="font-mono text-slate-400">Status: Protected</span>
        </div>
      )}

      {/* Live Processing Modal */}
      <LiveScannerModal
        isOpen={modalOpen}
        scanType={scanType}
        onClose={() => setModalOpen(false)}
        onScanCompleted={(res) => setLastScanResult(res)}
      />
    </div>
  );
}
