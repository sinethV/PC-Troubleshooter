import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ChevronRight,
  Clock,
  Shield,
  FileCheck,
  Check
} from 'lucide-react';
import Toast from '../components/common/Toast';
import { copyToClipboard } from '../utils/copyToClipboard';

const sampleGuides = [
  {
    id: 1,
    title: 'Windows 11 / 10 Corrupted System Files & BSOD Recovery',
    category: 'Windows Diagnostics',
    targetOs: 'Windows 11 / Windows 10',
    difficulty: 'BEGINNER',
    time: 20,
    symptoms: 'Random application crashes, BSOD stop codes (CRITICAL_PROCESS_DIED, SYSTEM_SERVICE_EXCEPTION), Explorer restarting unexpectedly.',
    steps: [
      {
        step: 1,
        title: 'Stage 1: Repair Windows Component Store with DISM',
        instruction: 'Launch PowerShell as Administrator. Run DISM RestoreHealth to ensure the local image repository is undamaged before fixing system files.',
        command: 'DISM /Online /Cleanup-Image /RestoreHealth',
        warning: 'Requires active internet access to pull authentic replacement binaries from Microsoft Update servers.',
        expected: '[==========================100.0%==========================] The restore operation completed successfully.'
      },
      {
        step: 2,
        title: 'Stage 2: Execute System File Checker (SFC)',
        instruction: 'Run the SFC utility to scan all protected system DLLs and replace damaged or altered files with verified copies.',
        command: 'sfc /scannow',
        warning: 'Do not close the console window until the scan reaches 100% completion.',
        expected: 'Verification 100% complete. Windows Resource Protection found corrupt files and successfully repaired them.'
      },
      {
        step: 3,
        title: 'Stage 3: Verify NTFS File System & Bad Sector Relocation',
        instruction: 'Schedule a CHKDSK scan on the system drive to ensure underlying disk clusters are physically and logically sound.',
        command: 'chkdsk C: /f',
        warning: 'Press Y when prompted to schedule the check at the next system restart.',
        expected: 'Chkdsk will examine file system integrity and orphaned index entries during boot.'
      },
      {
        step: 4,
        title: 'Stage 4: Post-Reboot Event Viewer Health Check',
        instruction: 'Restart the computer. After login, open Event Viewer (eventvwr.msc) and check Windows Logs > Application for "Wininit" events to confirm 0 bad sectors.',
        command: null,
        warning: 'If Blue Screens persist after these steps, proceed to RAM diagnostics using Windows Memory Diagnostic (mdsched.exe).',
        expected: 'Windows operates smoothly with no spontaneous stop codes or freeze states.'
      }
    ]
  },
  {
    id: 2,
    title: 'Complete Network & DNS Resolution Diagnostics',
    category: 'Network Diagnostics',
    targetOs: 'Windows 11 / 10 / Server',
    difficulty: 'BEGINNER',
    time: 15,
    symptoms: 'Computer displays "No Internet" yellow warning, websites cannot be reached by domain name, API requests fail with timeout.',
    steps: [
      {
        step: 1,
        title: 'Step 1: Check Adapter Address & Default Gateway',
        instruction: 'Run ipconfig /all to verify that the workstation received an IPv4 address from DHCP instead of a 169.254.x.x fallback address.',
        command: 'ipconfig /all',
        warning: 'If the address starts with 169.254.x.x, check Ethernet cabling, switch port VLAN, or router DHCP pool exhaustion.',
        expected: 'Valid IPv4 address, matching Subnet Mask, and reachable Default Gateway.'
      },
      {
        step: 2,
        title: 'Step 2: Flush Stale DNS Resolver Cache',
        instruction: 'Purge outdated DNS records cached on the local machine.',
        command: 'ipconfig /flushdns',
        warning: null,
        expected: 'Successfully flushed the DNS Resolver Cache.'
      },
      {
        step: 3,
        title: 'Step 3: Test Gateway & Outbound DNS Port Socket',
        instruction: 'Use PowerShell Test-NetConnection to probe Google Public DNS on port 53 to confirm outbound firewall rules allow DNS traffic.',
        command: 'Test-NetConnection -ComputerName 8.8.8.8 -Port 53 -InformationLevel Detailed',
        warning: 'If TcpTestSucceeded is false while local ping works, check router firewall or corporate proxy settings.',
        expected: 'TcpTestSucceeded : True.'
      },
      {
        step: 4,
        title: 'Step 4: TCP/IP Stack & Winsock Reset',
        instruction: 'If IP addressing is valid but the machine still cannot transmit sockets, reset the network stack and restart.',
        command: 'netsh int ip reset && netsh winsock reset',
        warning: 'Requires immediate system reboot to reinitialize the network catalog.',
        expected: 'Resetting Global, Interface, Subnet... OK! System restarts with fresh network catalog.'
      }
    ]
  },
  {
    id: 3,
    title: 'Print Spooler Stuck Queue & Offline Printer Recovery',
    category: 'Printer Support',
    targetOs: 'Windows 11 / 10 / Server',
    difficulty: 'BEGINNER',
    time: 10,
    symptoms: 'Documents remain stuck on "Printing" or "Deleting" forever, Print Spooler service stops itself, printer shows offline.',
    steps: [
      {
        step: 1,
        title: 'Step 1: Halt Spooler and Purge Corrupted Queue Files',
        instruction: 'Stop the Print Spooler service, remove all corrupted spool documents (.SPL/.SHD) from the spool folder, and restart the spooler.',
        command: 'net stop spooler && del /Q /F /S "%systemroot%\\System32\\Spool\\Printers\\*.*" && net start spooler',
        warning: 'Any unsent documents currently waiting in the queue will be cleared and must be resent by the user.',
        expected: 'The Print Spooler service was stopped successfully. Deleted stuck files. Service started successfully.'
      },
      {
        step: 2,
        title: 'Step 2: Verify Printer Status & Send Test Page',
        instruction: 'Open Windows Settings > Bluetooth & devices > Printers & scanners. Confirm the target printer displays status "Ready". Print a Windows Test Page.',
        command: null,
        warning: 'If printer remains offline, verify physical USB connection or ping the printer IP address.',
        expected: 'Printer prints the test page without errors.'
      }
    ]
  }
];

export default function Troubleshooting() {
  const [activeGuide, setActiveGuide] = useState(sampleGuides[0]);
  const [completedSteps, setCompletedSteps] = useState({});
  const [toast, setToast] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const toggleStepCompleted = (stepNum) => {
    setCompletedSteps(prev => ({
      ...prev,
      [`${activeGuide.id}_${stepNum}`]: !prev[`${activeGuide.id}_${stepNum}`]
    }));
  };

  const handleCopy = async (cmd, idx) => {
    const success = await copyToClipboard(cmd);
    if (success) {
      setCopiedIndex(idx);
      setToast({
        type: 'success',
        message: 'Step command copied to clipboard!'
      });
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            Interactive Troubleshooting Workflows
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Systematic step-by-step diagnostic guides designed for frontline IT field and helpdesk technicians.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Guide Selector */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Select Troubleshooting Procedure
          </h2>
          {sampleGuides.map((guide) => {
            const isSelected = activeGuide.id === guide.id;
            return (
              <div
                key={guide.id}
                onClick={() => {
                  setActiveGuide(guide);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                    {guide.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    {guide.time} min
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {guide.symptoms}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Guide Steps */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Guide Card */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
                <span>{activeGuide.category}</span>
                <span>•</span>
                <span>Target: {activeGuide.targetOs}</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">
                {activeGuide.title}
              </h2>
              <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                <strong className="text-slate-800">Reported Symptoms: </strong>
                {activeGuide.symptoms}
              </div>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-4 pt-2">
              {activeGuide.steps.map((st, idx) => {
                const isChecked = !!completedSteps[`${activeGuide.id}_${st.step}`];
                return (
                  <div
                    key={st.step}
                    className={`p-4 rounded-2xl border transition-all ${
                      isChecked
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-slate-50/60 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => toggleStepCompleted(st.step)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition border ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-slate-300 text-transparent hover:border-slate-400'
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                        <h4 className={`text-sm font-bold ${isChecked ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {st.title}
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        0{st.step}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 pl-8 mb-3 leading-relaxed">
                      {st.instruction}
                    </p>

                    {st.command && (
                      <div className="pl-8 mb-3">
                        <div className="relative">
                          <div className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                            <code>{st.command}</code>
                          </div>
                          <button
                            onClick={() => handleCopy(st.command, idx)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition shadow"
                            title="Copy command"
                          >
                            {copiedIndex === idx ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="pl-8 space-y-1.5 text-xs">
                      {st.warning && (
                        <div className="flex items-start gap-1.5 text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span><strong>Warning: </strong>{st.warning}</span>
                        </div>
                      )}
                      {st.expected && (
                        <div className="flex items-start gap-1.5 text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>Expected Result: </strong>{st.expected}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Verification and Save Report Footer */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Mark each step as verified before documenting resolution in ticket history.
              </span>
              <button
                onClick={() => {
                  setToast({
                    type: 'success',
                    message: 'Troubleshooting report ready to attach to ticket!',
                  });
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
              >
                <FileCheck className="w-4 h-4" />
                <span>Save Diagnostic Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
