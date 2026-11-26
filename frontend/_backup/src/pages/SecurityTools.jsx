import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertOctagon, Copy, CheckCircle } from 'lucide-react';
import Toast from '../components/common/Toast';
import { copyToClipboard } from '../utils/copyToClipboard';

export default function SecurityTools() {
  const [toast, setToast] = useState(null);
  const [copiedCmd, setCopiedCmd] = useState('');

  const commands = [
    {
      title: 'Query Microsoft Defender Antivirus Status',
      syntax: 'Get-MpComputerStatus | Select-Object AMServiceEnabled, AntispywareEnabled, RealTimeProtectionEnabled, AntivirusSignatureLastUpdated, QuickScanAge',
      desc: 'Confirms real-time protection engine state and definition signature freshness.',
      perm: 'Administrator'
    },
    {
      title: 'Trigger Background Quick Malware Scan',
      syntax: 'Start-MpScan -ScanType QuickScan',
      desc: 'Launches an immediate background malware scan of active memory and boot sectors.',
      perm: 'Administrator'
    },
    {
      title: 'Inspect Active Windows Firewall Profiles',
      syntax: 'netsh advfirewall show allprofiles',
      desc: 'Reports whether Domain, Private, and Public firewall profiles are enabled or blocking inbound traffic.',
      perm: 'Administrator'
    },
    {
      title: 'Trigger Microsoft Defender Signature Update',
      syntax: 'Update-MpSignature',
      desc: 'Forces the local antivirus engine to download the latest threat definitions from Microsoft.',
      perm: 'Administrator'
    }
  ];

  const handleCopy = async (cmd) => {
    const ok = await copyToClipboard(cmd);
    if (ok) {
      setCopiedCmd(cmd);
      setToast({ type: 'success', message: 'Security command copied!' });
      setTimeout(() => setCopiedCmd(''), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-purple-600" />
          IT Security & Maintenance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Defender antivirus status, definition updates, firewall auditing, and incident response checklists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {commands.map((cmd) => (
          <div key={cmd.title} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">{cmd.title}</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                {cmd.perm}
              </span>
            </div>
            <div className="relative">
              <div className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                <code>{cmd.syntax}</code>
              </div>
              <button
                onClick={() => handleCopy(cmd.syntax)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition shadow"
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
