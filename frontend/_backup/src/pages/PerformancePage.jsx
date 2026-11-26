import React, { useState, useEffect } from 'react';
import { Gauge, Cpu, Activity, HardDrive, Wifi, Sparkles, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';

export default function PerformancePage() {
  const [cpu, setCpu] = useState(24);
  const [ram, setRam] = useState(58);
  const [disk, setDisk] = useState(31);
  const [net, setNet] = useState(14);
  const [optimizing, setOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);

  // Startup apps list
  const [startupApps, setStartupApps] = useState([
    { id: 1, name: 'Spotify Web Helper', impact: 'Medium Impact', enabled: true },
    { id: 2, name: 'Microsoft Teams Telemetry', impact: 'High Impact', enabled: false },
    { id: 3, name: 'Discord Auto-Launch', impact: 'High Impact', enabled: false },
    { id: 4, name: 'Windows Security System Tray', impact: 'Low Impact', enabled: true },
    { id: 5, name: 'Google Chrome Background Service', impact: 'Medium Impact', enabled: false },
  ]);

  // Live fluctuating telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      setCpu(prev => Math.min(95, Math.max(14, prev + (Math.floor(Math.random() * 9) - 4))));
      setRam(prev => Math.min(85, Math.max(48, prev + (Math.floor(Math.random() * 5) - 2))));
      setNet(prev => Math.min(70, Math.max(5, prev + (Math.floor(Math.random() * 11) - 5))));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleOptimizeMemory = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      setOptimized(true);
      setRam(38); // Reclaimed 20% of memory
      setCpu(16);
      setTimeout(() => setOptimized(false), 3000);
    }, 1200);
  };

  const toggleStartup = (id) => {
    setStartupApps(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#14234b]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Gauge className="w-6 h-6 text-cyan-400" />
            System Performance & Memory Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time CPU and RAM telemetry, standby memory reclamation, and Windows boot delay optimization.
          </p>
        </div>

        <button
          onClick={handleOptimizeMemory}
          disabled={optimizing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/25 transition disabled:opacity-50"
        >
          {optimizing ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Zap className="w-4 h-4" />}
          {optimizing ? 'Purging Standby Memory...' : 'Optimize RAM & Flush Cache'}
        </button>
      </div>

      {optimized && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-slide-up">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>RAM standby list flushed successfully. Reclaimed 3.4 GB of physical memory.</span>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU */}
        <div className="p-5 rounded-3xl cyber-card border border-[#162752] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" /> CPU Load
            </span>
            <span className="text-[10px] text-slate-400 font-mono">2.45 GHz</span>
          </div>
          <span className="text-3xl font-black text-white font-mono">{cpu}%</span>
          <div className="w-full h-2 rounded-full bg-[#121e3f] overflow-hidden">
            <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${cpu}%` }}></div>
          </div>
        </div>

        {/* RAM */}
        <div className="p-5 rounded-3xl cyber-card border border-[#162752] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-400" /> RAM Memory
            </span>
            <span className="text-[10px] text-slate-400 font-mono">9.2 / 16 GB</span>
          </div>
          <span className="text-3xl font-black text-white font-mono">{ram}%</span>
          <div className="w-full h-2 rounded-full bg-[#121e3f] overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${ram}%` }}></div>
          </div>
        </div>

        {/* Disk */}
        <div className="p-5 rounded-3xl cyber-card border border-[#162752] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-indigo-400" /> NVMe SSD
            </span>
            <span className="text-[10px] text-slate-400 font-mono">149 / 476 GB</span>
          </div>
          <span className="text-3xl font-black text-white font-mono">{disk}%</span>
          <div className="w-full h-2 rounded-full bg-[#121e3f] overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${disk}%` }}></div>
          </div>
        </div>

        {/* Network */}
        <div className="p-5 rounded-3xl cyber-card border border-[#162752] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-emerald-400" /> Throughput
            </span>
            <span className="text-[10px] text-slate-400 font-mono">45.6 Mbps</span>
          </div>
          <span className="text-3xl font-black text-white font-mono">{net}%</span>
          <div className="w-full h-2 rounded-full bg-[#121e3f] overflow-hidden">
            <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${net}%` }}></div>
          </div>
        </div>
      </div>

      {/* Startup Applications Manager */}
      <div className="p-6 rounded-3xl cyber-card border border-[#162752] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Windows Startup Apps Manager
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Disable unnecessary auto-starting apps to accelerate computer boot time.</p>
          </div>
        </div>

        <div className="divide-y divide-[#14234b]">
          {startupApps.map(app => (
            <div key={app.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{app.name}</p>
                <p className="text-[11px] text-slate-400 font-medium">{app.impact}</p>
              </div>
              <button
                onClick={() => toggleStartup(app.id)}
                className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${app.enabled ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'}`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow"></div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
