import React, { useState } from 'react';
import {
  Monitor,
  CheckCircle,
  Copy,
  Terminal,
  AlertTriangle,
  FileSearch,
  Activity,
  HardDrive,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import RiskBadge from '../components/common/RiskBadge';
import Toast from '../components/common/Toast';
import { copyToClipboard } from '../utils/copyToClipboard';

const windowsTools = [
  {
    id: 'sfc',
    title: 'System File Checker (SFC)',
    tag: 'Integrity Repair',
    command: 'sfc /scannow',
    risk: 'SAFE',
    permission: 'Administrator',
    description: 'Scans all protected Windows system files and replaces corrupted files with a cached copy.',
    whenToUse: 'After blue screens (BSOD), explorer crashes, or unexpected system errors.',
    verification: 'Wait for 100% completion. Look for "Windows Resource Protection did not find any integrity violations" or "...repaired them".'
  },
  {
    id: 'dism',
    title: 'DISM Component Store Repair',
    tag: 'Image Servicing',
    command: 'DISM /Online /Cleanup-Image /RestoreHealth',
    risk: 'SAFE',
    permission: 'Administrator',
    description: 'Fixes corrupted files in the Windows Component Store using Windows Update as a source.',
    whenToUse: 'Run prior to SFC or when SFC reports files could not be repaired.',
    verification: 'Check for "[100.0%] The restore operation completed successfully."'
  },
  {
    id: 'chkdsk',
    title: 'Check Disk Volume Integrity',
    tag: 'File System',
    command: 'chkdsk C: /f /r',
    risk: 'HIGH',
    permission: 'Administrator',
    description: 'Locates bad sectors and recovers readable information; fixes disk file system errors.',
    whenToUse: 'Disk read failures, NTFS corruption events (Event ID 55), or random file locks.',
    verification: 'Schedules disk check upon reboot. Review Event Viewer (Wininit log) afterwards.'
  },
  {
    id: 'wu-reset',
    title: 'Windows Update Cache Purge',
    tag: 'Update Repair',
    command: 'net stop wuauserv && net stop bits && ren %systemroot%\\SoftwareDistribution SoftwareDistribution.old && net start wuauserv && net start bits',
    risk: 'MODERATE',
    permission: 'Administrator',
    description: 'Stops Windows Update services, renames the cache folder to force re-download, and restarts services.',
    whenToUse: 'Updates stuck at 0%, error codes 0x80070002, 0x800f081f, or download loops.',
    verification: 'Go to Settings > Windows Update and click "Check for updates".'
  },
  {
    id: 'event-viewer',
    title: 'Query Critical System Crashes',
    tag: 'Diagnostic Query',
    command: 'Get-WinEvent -FilterHashtable @{LogName=\'System\'; Level=1,2} -MaxEvents 15 | Select-Object TimeCreated, Id, ProviderName, Message | Format-Table -Wrap',
    risk: 'SAFE',
    permission: 'Administrator',
    description: 'PowerShell query fetching the 15 most recent Critical (Level 1) and Error (Level 2) events from the System event log.',
    whenToUse: 'Immediate diagnosis after an unprompted reboot or hardware freeze.',
    verification: 'Identify recurring Event IDs (e.g. 41 Kernel-Power, 7 Disk, 1001 BugCheck).'
  },
  {
    id: 'sysinfo',
    title: 'Comprehensive System Information',
    tag: 'Hardware & OS Spec',
    command: 'systeminfo',
    risk: 'SAFE',
    permission: 'Standard User',
    description: 'Displays detailed configuration information about a computer and its operating system, hotfixes, and BIOS version.',
    whenToUse: 'When auditing hardware model, BIOS version, memory, and OS build numbers.',
    verification: 'Outputs OS Name, Version, System Manufacturer, Model, Processors, and BIOS Version.'
  }
];

export default function WindowsTools() {
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (cmd, id) => {
    const success = await copyToClipboard(cmd);
    if (success) {
      setCopiedId(id);
      setToast({
        type: 'success',
        message: 'Command copied to clipboard!',
      });
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Monitor className="w-6 h-6 text-blue-600" />
            Windows Diagnostic & Repair Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Certified procedures for Windows 11 and Windows 10 boot, BSOD, component store, and update recovery.
          </p>
        </div>
      </div>

      {/* Recommended 3-Step Windows Repair Pipeline */}
      <div className="p-6 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl shadow-md border border-slate-800">
        <h2 className="text-base font-bold flex items-center gap-2 mb-2 text-white">
          <Zap className="w-5 h-5 text-amber-400" />
          The Standard "Golden Triage" Workflow for Unstable Windows
        </h2>
        <p className="text-xs text-slate-300 mb-4 max-w-3xl leading-relaxed">
          When Windows experiences random freezing, BSODs, or missing system files, always run these three diagnostic tools in exact order:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-1">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400">1</span>
              Step 1: DISM
            </div>
            <p className="text-xs text-slate-200 font-mono bg-slate-950 p-2 rounded border border-slate-800 truncate">
              DISM /Online /Cleanup-Image /RestoreHealth
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5">Repairs the staging component store repository first.</p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400">2</span>
              Step 2: SFC
            </div>
            <p className="text-xs text-slate-200 font-mono bg-slate-950 p-2 rounded border border-slate-800 truncate">
              sfc /scannow
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5">Uses the clean store to repair live Windows binaries.</p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400">3</span>
              Step 3: CHKDSK
            </div>
            <p className="text-xs text-slate-200 font-mono bg-slate-950 p-2 rounded border border-slate-800 truncate">
              chkdsk C: /f
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5">Verifies disk filesystem integrity and clears bad metadata.</p>
          </div>
        </div>
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {windowsTools.map((tool) => (
          <div
            key={tool.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-sm transition space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {tool.tag}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-500">{tool.permission}</span>
              </div>
              <RiskBadge level={tool.risk} />
            </div>

            <h3 className="text-sm font-bold text-slate-900">{tool.title}</h3>

            {/* Command Syntax Box */}
            <div className="relative">
              <div className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                <code>{tool.command}</code>
              </div>
              <button
                onClick={() => handleCopy(tool.command, tool.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition shadow"
                title="Copy command"
              >
                {copiedId === tool.id ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{tool.description}</p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <div>
                <strong className="text-slate-700">When to use: </strong>
                <span className="text-slate-600">{tool.whenToUse}</span>
              </div>
              <div>
                <strong className="text-slate-700">Verification: </strong>
                <span className="text-slate-600">{tool.verification}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
