import React, { useState } from 'react';
import { Printer, Copy, CheckCircle, RefreshCw } from 'lucide-react';
import Toast from '../components/common/Toast';
import { copyToClipboard } from '../utils/copyToClipboard';

export default function PrinterSupport() {
  const [toast, setToast] = useState(null);
  const [copiedCmd, setCopiedCmd] = useState('');

  const commands = [
    {
      title: 'Force Purge Print Spooler & Hung Queues',
      syntax: 'net stop spooler && del /Q /F /S "%systemroot%\\System32\\Spool\\Printers\\*.*" && net start spooler',
      desc: 'Halts the Print Spooler, wipes stuck .SPL and .SHD documents, and cleanly restarts the service.',
      perm: 'Administrator'
    },
    {
      title: 'List All Installed Printers & Port Names',
      syntax: 'Get-Printer | Select-Object Name, DriverName, PortName, PrinterStatus, Shared',
      desc: 'PowerShell query displaying local, network, and virtual printers with active port bindings.',
      perm: 'Standard User'
    },
    {
      title: 'Restart Print Spooler Service via PowerShell',
      syntax: 'Restart-Service -Name Spooler -Force',
      desc: 'Restarts the spooler service cleanly without touching pending queues.',
      perm: 'Administrator'
    },
    {
      title: 'Clear Printer Drivers via Print Management Console',
      syntax: 'printmanagement.msc',
      desc: 'Opens the administrative Print Management GUI for uninstalling corrupt driver packages.',
      perm: 'Administrator'
    }
  ];

  const handleCopy = async (cmd) => {
    const ok = await copyToClipboard(cmd);
    if (ok) {
      setCopiedCmd(cmd);
      setToast({ type: 'success', message: 'Printer command copied!' });
      setTimeout(() => setCopiedCmd(''), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Printer className="w-6 h-6 text-blue-600" />
          Printer Support & Spooler Recovery
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Resolve stuck print jobs, offline printer flags, driver locks, and network port redirection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {commands.map((cmd) => (
          <div key={cmd.title} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">{cmd.title}</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                {cmd.perm}
              </span>
            </div>
            <div className="relative">
              <div className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                <code>{cmd.syntax}</code>
              </div>
              <button
                onClick={() => handleCopy(cmd.syntax)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition shadow"
              >
                {copiedCmd === cmd.syntax ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-slate-600">{cmd.desc}</p>
          </div>
        ))}
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
