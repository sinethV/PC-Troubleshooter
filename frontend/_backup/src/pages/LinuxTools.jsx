import React, { useState } from 'react';
import { TerminalSquare, Server, Copy, CheckCircle } from 'lucide-react';
import Toast from '../components/common/Toast';
import { copyToClipboard } from '../utils/copyToClipboard';

export default function LinuxTools() {
  const [toast, setToast] = useState(null);
  const [copiedCmd, setCopiedCmd] = useState('');

  const commands = [
    {
      title: 'Real-time Syslog & Kernel Stream',
      syntax: 'journalctl -xeu systemd-resolved.service -f',
      desc: 'Follow live systemd service logs and debugging output.',
      perm: 'sudo / root'
    },
    {
      title: 'Human-Readable Disk Free Space',
      syntax: 'df -hT --exclude-type=tmpfs --exclude-type=devtmpfs',
      desc: 'Audits mounted partitions, filesystem types, and percentage space used.',
      perm: 'Standard User'
    },
    {
      title: 'Active Listening Ports & Sockets',
      syntax: 'ss -tulpn | grep LISTEN',
      desc: 'Modern replacement for netstat showing listening TCP/UDP sockets and process names.',
      perm: 'sudo / root'
    },
    {
      title: 'Restart Systemd Service & Inspect Status',
      syntax: 'systemctl restart nginx && systemctl status nginx --no-pager',
      desc: 'Gracefully cycles a system service and verifies active operational status.',
      perm: 'sudo'
    }
  ];

  const handleCopy = async (cmd) => {
    const ok = await copyToClipboard(cmd);
    if (ok) {
      setCopiedCmd(cmd);
      setToast({ type: 'success', message: 'Linux command copied!' });
      setTimeout(() => setCopiedCmd(''), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <TerminalSquare className="w-6 h-6 text-slate-800" />
          Linux Administration Toolkit
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Essential Linux terminal commands for systemd service control, disk utilization, SSH diagnosis, and syslog queries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {commands.map((cmd) => (
          <div key={cmd.title} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">{cmd.title}</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {cmd.perm}
              </span>
            </div>
            <div className="relative">
              <div className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                <code>{cmd.syntax}</code>
              </div>
              <button
                onClick={() => handleCopy(cmd.syntax)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition shadow"
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
