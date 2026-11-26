import React, { useState } from 'react';
import { Server, Users, Key, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import Toast from '../components/common/Toast';
import { copyToClipboard } from '../utils/copyToClipboard';

export default function ServerTools() {
  const [toast, setToast] = useState(null);
  const [copiedCmd, setCopiedCmd] = useState('');

  const commands = [
    {
      title: 'Force Group Policy Update',
      syntax: 'gpupdate /force',
      desc: 'Refreshes user and computer Group Policy settings immediately from the Domain Controller.',
      perm: 'Administrator'
    },
    {
      title: 'Generate Group Policy Results HTML Report',
      syntax: 'gpresult /h "C:\\gpresult.html"',
      desc: 'Creates detailed report of applied GPOs, security filtering, and inheritance.',
      perm: 'Administrator'
    },
    {
      title: 'Verify Domain Controller Reachability & Secure Channel',
      syntax: 'Test-ComputerSecureChannel -Verbose',
      desc: 'Checks if the local workstation has a healthy trust relationship with the Active Directory domain.',
      perm: 'Administrator'
    },
    {
      title: 'Locate Active Directory Domain Controller',
      syntax: 'nltest /dsgetdc:yourdomain.com',
      desc: 'Identifies which Domain Controller is actively responding to authentication and directory requests.',
      perm: 'Standard User'
    }
  ];

  const handleCopy = async (cmd) => {
    const ok = await copyToClipboard(cmd);
    if (ok) {
      setCopiedCmd(cmd);
      setToast({ type: 'success', message: 'AD command copied!' });
      setTimeout(() => setCopiedCmd(''), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Server className="w-6 h-6 text-indigo-600" />
          Windows Server & Active Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Domain join troubleshooting, Group Policy (GPO) inspection, secure channel verification, and DNS server triage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {commands.map((cmd) => (
          <div key={cmd.title} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">{cmd.title}</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                {cmd.perm}
              </span>
            </div>
            <div className="relative">
              <div className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                <code>{cmd.syntax}</code>
              </div>
              <button
                onClick={() => handleCopy(cmd.syntax)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition shadow"
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
