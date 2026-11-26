import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  X,
  Play,
  Pause,
  RefreshCw,
  Terminal,
  Trash2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function LiveScannerModal({
  isOpen,
  scanType = 'quick_scan',
  onClose,
  onScanCompleted
}) {
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentFile, setCurrentFile] = useState('Initializing scan engine...');
  const [scannedCount, setScannedCount] = useState(0);
  const [discoveredIssues, setDiscoveredIssues] = useState([]);
  const [scanFinished, setScanFinished] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [fixedFinished, setFixedFinished] = useState(false);

  const timerRef = useRef(null);

  const scanProfiles = {
    quick_scan: {
      title: 'Quick System & Threat Scan',
      color: 'cyan',
      paths: [
        'C:\\Windows\\System32\\ntoskrnl.exe',
        'C:\\Windows\\System32\\drivers\\etc\\hosts',
        'C:\\Users\\neth\\AppData\\Local\\Temp\\session_cache.tmp',
        'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\updater.exe',
        'C:\\Windows\\System32\\services.exe',
        'C:\\ProgramData\\Microsoft\\Windows Defender\\Scans\\History',
        'C:\\Users\\neth\\Downloads\\setup_unverified.exe',
        'C:\\Windows\\System32\\svchost.exe [PID 1420]',
        'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved'
      ],
      mockFindings: [
        { id: 1, name: 'Suspicious Temporary Executable', path: 'AppData\\Local\\Temp\\session_cache.tmp', severity: 'HIGH', category: 'Malware' },
        { id: 2, name: 'Unquoted Service Path detected', path: 'System32\\Drivers\\LegacyService.sys', severity: 'MEDIUM', category: 'Security' },
        { id: 3, name: 'Stale DNS Cache Entry (Poisoned IP)', path: 'TCP/IP Resolver Stack', severity: 'LOW', category: 'Network' }
      ]
    },
    privacy_scan: {
      title: 'Privacy & Tracking Audit',
      color: 'emerald',
      paths: [
        'Chrome::User Data\\Default\\Cookies',
        'Edge::User Data\\Default\\IndexedDB',
        'C:\\ProgramData\\Microsoft\\Diagnosis\\ETLLogs',
        'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Diagnostics\\DiagTrack',
        'Firefox::Profiles\\default-release\\cookies.sqlite',
        'System::Clipboard History Cache',
        'Windows::Recent Documents History',
        'Network::DNS Client Resolution Cache'
      ],
      mockFindings: [
        { id: 101, name: 'Cross-Site Advertising Tracking Cookies (126 detected)', path: 'Chrome & Edge Browser Storage', severity: 'MEDIUM', category: 'Privacy' },
        { id: 102, name: 'Windows Diagnostic Telemetry Level Enhanced', path: 'HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection', severity: 'LOW', category: 'Telemetry' },
        { id: 103, name: 'Unencrypted Clipboard Buffer History', path: 'C:\\Users\\neth\\AppData\\Local\\Clipboard', severity: 'MEDIUM', category: 'Privacy' }
      ]
    },
    vulnerability_check: {
      title: 'System Vulnerability & Patch Check',
      color: 'amber',
      paths: [
        'Windows Update Service::Checking catalog KB5034441',
        'C:\\Program Files\\Google\\Chrome\\chrome.exe',
        'C:\\Program Files\\Git\\bin\\git.exe',
        'C:\\Program Files\\PostgreSQL\\17\\bin\\postgres.exe',
        'OpenSSL::C:\\Windows\\System32\\libcrypto-3-x64.dll',
        'Firewall Rule::Port 445 (SMB) Inbound state',
        'Windows Defender::Antivirus Definitions DB'
      ],
      mockFindings: [
        { id: 201, name: 'Outdated Browser Runtime (Version 122 -> 131)', path: 'Google Chrome', severity: 'CRITICAL', category: 'Software' },
        { id: 202, name: 'Missing Security Patch KB5034441', path: 'Windows 11 Servicing Stack', severity: 'HIGH', category: 'Windows OS' },
        { id: 203, name: 'Insecure SMBv1 Protocol Optional Component', path: 'Windows Optional Features', severity: 'MEDIUM', category: 'Network' }
      ]
    },
    malware_removal: {
      title: 'Deep Malware & Rootkit Elimination',
      color: 'purple',
      paths: [
        'Scanning Master Boot Record (MBR) on Drive 0',
        'Scanning Kernel Driver Signatures',
        'Analyzing System Memory Hooks and DLL Injections',
        'C:\\Users\\neth\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup',
        'Inspecting WMI Event Consumers',
        'Scanning Scheduled Tasks for Rogue Triggers',
        'Analyzing PowerShell Encoded Execution History'
      ],
      mockFindings: [
        { id: 301, name: 'Trojan.Win64.Generic Dropper in Recycle Bin', path: '$Recycle.Bin\\S-1-5-21\\installer.exe', severity: 'CRITICAL', category: 'Trojan' },
        { id: 302, name: 'Adware Browser Extension Helper', path: 'Chrome WebStore::HelperAddon_v2', severity: 'HIGH', category: 'Adware' }
      ]
    },
    app_updates: {
      title: 'Installed Software Updates Scan',
      color: 'emerald',
      paths: [
        'Querying Winget & Chocolatey software catalog...',
        'Checking Node.js LTS packages (Current: v24.17.0)',
        'Checking Visual Studio Code Extensions',
        'Checking 7-Zip (Installed: 23.01, Latest: 24.08)',
        'Checking Git for Windows (Installed: 2.45.0, Latest: 2.54.0)'
      ],
      mockFindings: [
        { id: 401, name: '7-Zip 24.08 Available (Security fixes)', path: 'C:\\Program Files\\7-Zip', severity: 'MEDIUM', category: 'App Update' },
        { id: 402, name: 'Git for Windows Update v2.54.0', path: 'C:\\Program Files\\Git', severity: 'LOW', category: 'App Update' },
        { id: 403, name: 'PostgreSQL Minor Security Revision 17.2', path: 'C:\\Program Files\\PostgreSQL', severity: 'LOW', category: 'Database' }
      ]
    }
  };

  const activeProfile = scanProfiles[scanType] || scanProfiles.quick_scan;

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setIsScanning(false);
      setScanFinished(false);
      setDiscoveredIssues([]);
      setScannedCount(0);
      setIsFixing(false);
      setFixedFinished(false);
      return;
    }

    setIsScanning(true);
    setProgress(0);
    setScanFinished(false);
    setDiscoveredIssues([]);
    setScannedCount(0);
    setIsFixing(false);
    setFixedFinished(false);

    let currentProg = 0;
    let fileIdx = 0;
    let localFound = [];

    const interval = setInterval(() => {
      if (isPaused) return;

      currentProg += Math.floor(Math.random() * 4) + 2;
      fileIdx = (fileIdx + 1) % activeProfile.paths.length;
      setCurrentFile(activeProfile.paths[fileIdx]);
      setScannedCount(prev => prev + Math.floor(Math.random() * 240) + 120);

      // Trigger finding discoveries at certain percentages
      if (currentProg > 25 && localFound.length === 0 && activeProfile.mockFindings[0]) {
        localFound = [activeProfile.mockFindings[0]];
        setDiscoveredIssues([...localFound]);
      }
      if (currentProg > 60 && localFound.length === 1 && activeProfile.mockFindings[1]) {
        localFound = [activeProfile.mockFindings[0], activeProfile.mockFindings[1]];
        setDiscoveredIssues([...localFound]);
      }
      if (currentProg > 85 && localFound.length === 2 && activeProfile.mockFindings[2]) {
        localFound = [...activeProfile.mockFindings];
        setDiscoveredIssues([...localFound]);
      }

      if (currentProg >= 100) {
        currentProg = 100;
        setProgress(100);
        setIsScanning(false);
        setScanFinished(true);
        setCurrentFile('Scan execution complete.');
        clearInterval(interval);
      } else {
        setProgress(currentProg);
      }
    }, 180);

    timerRef.current = interval;
    return () => clearInterval(interval);
  }, [isOpen, scanType]);

  const handleFixAll = () => {
    setIsFixing(true);
    setTimeout(() => {
      setIsFixing(false);
      setFixedFinished(true);
      setDiscoveredIssues([]);
      if (onScanCompleted) {
        onScanCompleted({
          type: scanType,
          title: activeProfile.title,
          fixedCount: activeProfile.mockFindings.length
        });
      }
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#0c142b] border border-[#1b2c56] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#16254c] bg-[#080e22]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">{activeProfile.title}</h3>
              <p className="text-[11px] text-slate-400">
                Live TechFix Pro Diagnostics Engine • High Precision Analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Circular Progress & Live Path Box */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-[#090f24] border border-[#14234b]">
            {/* SVG Ring Gauge */}
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="#132042"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="url(#cyanGlow)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={326.7}
                  strokeDashoffset={326.7 - (326.7 * progress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-200"
                />
                <defs>
                  <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d8f6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-white tracking-tight">
                  {progress}%
                </span>
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold">
                  {scanFinished ? 'DONE' : 'SCANNING'}
                </span>
              </div>
            </div>

            {/* Status details & stream */}
            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Items Scanned: <strong className="text-white font-mono">{scannedCount.toLocaleString()}</strong></span>
                <span>Threats Detected: <strong className={`font-mono ${discoveredIssues.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{discoveredIssues.length}</strong></span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[#132042] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Live file scanning terminal */}
              <div className="p-3 rounded-xl bg-black/60 border border-[#16254c] text-[11px] font-mono text-cyan-300 truncate">
                <span className="text-slate-500 mr-2">$</span>
                {currentFile}
              </div>
            </div>
          </div>

          {/* Discovered Issues Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Analysis & Discovered Anomalies ({discoveredIssues.length})
              </h4>
              {scanFinished && discoveredIssues.length === 0 && !fixedFinished && (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All clean. No threats found.
                </span>
              )}
            </div>

            {discoveredIssues.length === 0 && !fixedFinished ? (
              <div className="p-8 text-center bg-[#090f24] rounded-2xl border border-[#14234b] text-slate-400 space-y-1">
                {isScanning ? (
                  <>
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-400 mb-2" />
                    <p className="text-xs font-medium">Scanning memory, registry, and storage sectors...</p>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                    <p className="text-sm font-bold text-white">System is Pristine</p>
                    <p className="text-xs text-slate-400">No vulnerabilities or threats were detected in this pass.</p>
                  </>
                )}
              </div>
            ) : fixedFinished ? (
              <div className="p-6 text-center bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-emerald-300 space-y-2">
                <Sparkles className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-white">All Issues Successfully Remediated!</h4>
                <p className="text-xs text-slate-300">
                  Cache purged, infected scripts neutralized, and security health restored to 100%.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {discoveredIssues.map(issue => (
                  <div
                    key={issue.id}
                    className="p-3.5 rounded-xl bg-[#090f24] border border-[#162752] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        issue.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                        issue.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        {issue.severity === 'CRITICAL' ? <Flame className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{issue.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">{issue.path}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#132042] text-slate-300">
                      {issue.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#080e22] border-t border-[#16254c]">
          <div className="flex items-center gap-2">
            {isScanning && (
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#132042] hover:bg-[#1a2d5c] text-xs font-semibold text-slate-300 transition"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            )}
            <span className="text-[11px] text-slate-400">
              {scanFinished ? 'Process completed' : isPaused ? 'Scan paused' : 'Real-time heuristics active'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {scanFinished && discoveredIssues.length > 0 && !fixedFinished && (
              <button
                onClick={handleFixAll}
                disabled={isFixing}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 transition disabled:opacity-50"
              >
                {isFixing ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Trash2 className="w-4 h-4" />}
                {isFixing ? 'Cleaning System...' : 'Fix All Issues Now'}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#132042] hover:bg-[#1a2d5c] text-slate-300 text-xs font-semibold transition"
            >
              {fixedFinished || (scanFinished && discoveredIssues.length === 0) ? 'Close' : 'Cancel'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
