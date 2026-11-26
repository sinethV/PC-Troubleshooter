import React, { useState, useMemo } from 'react';
import {
  X,
  Cpu,
  HardDrive,
  Activity,
  Wifi,
  Monitor,
  Battery,
  Key,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Wrench,
  Sparkles,
  Search,
  RotateCcw,
  BookOpen,
  FileCode,
  Download
} from 'lucide-react';
import { copyToClipboard } from '../../utils/copyToClipboard';

export default function ModelDetailsModal({ model, onClose }) {
  const [activeTab, setActiveTab] = useState('problems'); // 'problems', 'specs', 'recovery', 'script'
  const [problemSearch, setProblemSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  if (!model) return null;

  const handleCopy = async (cmd, id) => {
    const ok = await copyToClipboard(cmd);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Filter problems within this model
  const filteredProblems = useMemo(() => {
    if (!problemSearch.trim()) return model.commonIssues;
    const q = problemSearch.toLowerCase().trim();
    return model.commonIssues.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.symptoms.toLowerCase().includes(q) ||
        p.cause.toLowerCase().includes(q) ||
        p.solution.toLowerCase().includes(q)
    );
  }, [model.commonIssues, problemSearch]);

  // Model-specific PowerShell hardware audit script
  const generatedAuditScript = `# TechFix Pro - Automated Hardware Audit Script
# Model: ${model.brand} ${model.model}
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Running TechFix Pro Diagnostic Audit for ${model.brand} ${model.model}..." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. System & Motherboard Information
Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer, Model, TotalPhysicalMemory
Get-CimInstance Win32_BIOS | Select-Object SMBIOSBIOSVersion, ReleaseDate

# 2. CPU & Thermal State Check
Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed

# 3. Storage SMART & NVMe Health Check
Get-PhysicalDisk | Select-Object FriendlyName, MediaType, OperationalStatus, HealthStatus, Size

# 4. Battery Wear Check
if (Get-CimInstance Win32_Battery -ErrorAction SilentlyContinue) {
    powercfg /batteryreport /output "$env:USERPROFILE\\Desktop\\${model.id}-battery-report.html"
    Write-Host "Battery Report generated to Desktop" -ForegroundColor Yellow
}

# 5. Network Adapters Health
Get-NetAdapter | Select-Object Name, InterfaceDescription, Status, LinkSpeed

Write-Host "Diagnostic audit complete. Review output above." -ForegroundColor Cyan`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="relative w-full max-w-4xl bg-[#0c142b] border border-[#1b2c56] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-[#16254c] bg-[#080e22] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-neon-cyan">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-400 text-slate-950">
                  {model.brand}
                </span>
                <span className="text-xs font-semibold text-slate-400">{model.series}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 font-mono">{model.year}</span>
                <span className="text-slate-600">•</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-medium">
                  {model.category}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mt-0.5">
                {model.model}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#132042] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 px-6 pt-3 border-b border-[#16254c] bg-[#090f24] text-xs font-bold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('problems')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'problems'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Known Problems & Solutions ({model.commonIssues.length})
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Hardware Specifications
          </button>

          <button
            onClick={() => setActiveTab('recovery')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'recovery'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            BIOS & Boot Keys
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'script'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Diagnostic Script
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* TAB 1: Common Problems & Technician Solutions */}
          {activeTab === 'problems' && (
            <div className="space-y-4">
              
              {/* Problem search bar inside modal */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={problemSearch}
                    onChange={(e) => setProblemSearch(e.target.value)}
                    placeholder={`Search problems for ${model.brand} ${model.model} (e.g., wifi, fan, screen, battery)...`}
                    className="w-full pl-10 pr-9 py-2 text-xs bg-[#090f24] border border-[#162752] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  {problemSearch && (
                    <button
                      onClick={() => setProblemSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">
                  {filteredProblems.length} of {model.commonIssues.length} issues
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 flex items-center justify-between">
                <span>Verified technician troubleshooting procedures with copyable automation scripts.</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 shrink-0">
                  TechFix Pro Certified
                </span>
              </div>

              {filteredProblems.length === 0 ? (
                <div className="p-8 text-center bg-[#090f24] border border-[#162752] rounded-2xl">
                  <p className="text-slate-400 text-sm">No specific issues matched "{problemSearch}".</p>
                  <button
                    onClick={() => setProblemSearch('')}
                    className="mt-2 text-xs text-cyan-400 hover:underline"
                  >
                    Clear problem filter
                  </button>
                </div>
              ) : (
                filteredProblems.map((issue, idx) => (
                  <div
                    key={issue.id}
                    className="p-5 rounded-2xl bg-[#090f24] border border-[#162752] space-y-3 transition hover:border-[#1e356e]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-white">{issue.title}</h4>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#0e1732] border border-[#1a2d5c]">
                        <strong className="text-rose-400">Symptoms: </strong>
                        <span className="text-slate-300">{issue.symptoms}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#0e1732] border border-[#1a2d5c]">
                        <strong className="text-amber-400">Root Cause: </strong>
                        <span className="text-slate-300">{issue.cause}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-200">
                        <strong className="text-emerald-400">Recommended Solution: </strong>
                        <span>{issue.solution}</span>
                      </div>
                    </div>

                    {/* Copyable Command */}
                    {issue.command && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Automated Remediation Script (PowerShell / CMD)
                          </span>
                          <button
                            onClick={() => handleCopy(issue.command, issue.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300"
                          >
                            {copiedId === issue.id ? (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Copied to Clipboard
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Copy className="w-3.5 h-3.5" /> Copy Command
                              </span>
                            )}
                          </button>
                        </div>
                        <div className="p-3 bg-black/60 rounded-xl font-mono text-xs text-cyan-300 border border-[#182a54] overflow-x-auto">
                          <code>{issue.command}</code>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Hardware Specifications */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#090f24] border border-[#162752] space-y-1">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" /> Processor (CPU)
                </span>
                <p className="font-bold text-white font-mono">{model.specs.cpu}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#090f24] border border-[#162752] space-y-1">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-400" /> Graphics (GPU)
                </span>
                <p className="font-bold text-white font-mono">{model.specs.gpu}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#090f24] border border-[#162752] space-y-1">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-indigo-400" /> RAM Memory & Expansion
                </span>
                <p className="font-bold text-white font-mono">{model.specs.ram}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#090f24] border border-[#162752] space-y-1">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-purple-400" /> Storage Slots
                </span>
                <p className="font-bold text-white font-mono">{model.specs.storage}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#090f24] border border-[#162752] space-y-1">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-emerald-400" /> Display Panel
                </span>
                <p className="font-bold text-white font-mono">{model.specs.display}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#090f24] border border-[#162752] space-y-1">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Battery className="w-4 h-4 text-amber-400" /> Battery & Power Supply
                </span>
                <p className="font-bold text-white font-mono">{model.specs.battery}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#090f24] border border-[#162752] space-y-1 col-span-1 md:col-span-2">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Wifi className="w-4 h-4 text-teal-400" /> Wireless Adapter & Card
                </span>
                <p className="font-bold text-white font-mono">{model.specs.wifi}</p>
              </div>
            </div>
          )}

          {/* TAB 3: Official BIOS & Boot Recovery Keys */}
          {activeTab === 'recovery' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#090f24] border border-[#162752] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Key className="w-4 h-4" /> Startup & Recovery Hotkey Sequences
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#0e1732] border border-[#1a2d5c]">
                    <span className="text-slate-400 block mb-1">Enter UEFI / BIOS Setup</span>
                    <span className="font-mono font-bold text-white text-sm bg-black/40 px-2.5 py-1 rounded border border-slate-700">
                      {model.recoveryKeys.biosKey}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0e1732] border border-[#1a2d5c]">
                    <span className="text-slate-400 block mb-1">One-Time Boot Menu</span>
                    <span className="font-mono font-bold text-white text-sm bg-black/40 px-2.5 py-1 rounded border border-slate-700">
                      {model.recoveryKeys.bootMenu}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0e1732] border border-[#1a2d5c]">
                    <span className="text-slate-400 block mb-1">Factory Recovery Partition</span>
                    <span className="font-mono font-bold text-white text-sm bg-black/40 px-2.5 py-1 rounded border border-slate-700">
                      {model.recoveryKeys.recoveryPartition}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0e1732] border border-[#1a2d5c]">
                    <span className="text-slate-400 block mb-1">Hardware Diagnostic Test</span>
                    <span className="font-mono font-bold text-white text-sm bg-black/40 px-2.5 py-1 rounded border border-slate-700">
                      {model.recoveryKeys.diagnosticTest}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Reboot to UEFI Command */}
              <div className="p-4 rounded-2xl bg-[#090f24] border border-[#162752] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" /> Direct Windows Reboot to UEFI Firmware
                  </span>
                  <button
                    onClick={() => handleCopy('shutdown /r /fw /t 0', 'reboot-uefi')}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {copiedId === 'reboot-uefi' ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Copied
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="w-3.5 h-3.5" /> Copy Command
                      </span>
                    )}
                  </button>
                </div>
                <div className="p-2.5 bg-black/60 rounded-xl font-mono text-xs text-cyan-300 border border-[#182a54]">
                  <code>shutdown /r /fw /t 0</code>
                </div>
                <p className="text-[11px] text-slate-400">
                  Runs with administrator privileges to restart directly into motherboard UEFI setup without needing to press hotkeys.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-amber-300">
                <p className="font-bold mb-1">Technician Tip for Fast Startup:</p>
                If Windows Fast Startup is enabled in Control Panel, hotkeys like F2 or F12 may be bypassed during restart. Hold the <strong>Shift</strong> key while clicking <strong>Restart</strong> in Windows to force UEFI firmware access.
              </div>
            </div>
          )}

          {/* TAB 4: Automated Model Diagnostic Script */}
          {activeTab === 'script' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-cyan-300 flex items-center justify-between">
                <span>Custom PowerShell audit script generated for {model.brand} {model.model}.</span>
                <button
                  onClick={() => handleCopy(generatedAuditScript, 'audit-script')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 transition flex items-center gap-1.5"
                >
                  {copiedId === 'audit-script' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Copied Script
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Full Script
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-black/70 border border-[#1b2c56] font-mono text-xs text-slate-300 overflow-x-auto max-h-[350px]">
                <pre>{generatedAuditScript}</pre>
              </div>

              <p className="text-[11px] text-slate-400">
                How to run: Open PowerShell as Administrator on the client PC, paste the script above, and press Enter to generate full system, storage, battery, and network telemetry.
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#080e22] border-t border-[#16254c] text-xs">
          <span className="text-slate-400">
            TechFix Pro Knowledgebase v2.4 • Model ID: <strong className="text-cyan-400 font-mono">{model.id}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#132042] hover:bg-[#1a2d5c] text-white font-bold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
