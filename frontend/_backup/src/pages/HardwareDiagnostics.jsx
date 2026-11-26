import React, { useState } from 'react';
import { Cpu, HardDrive, Thermometer, Activity, Copy, CheckCircle, ShieldCheck } from 'lucide-react';
import Toast from '../components/common/Toast';
import { copyToClipboard } from '../utils/copyToClipboard';

export default function HardwareDiagnostics() {
  const [toast, setToast] = useState(null);
  const [copiedCmd, setCopiedCmd] = useState('');

  const commands = [
    {
      title: 'Physical Disk SMART Health & Media Type',
      syntax: 'Get-PhysicalDisk | Select-Object DeviceId, FriendlyName, MediaType, HealthStatus, OperationalStatus, Size',
      desc: 'Quickly identifies NVMe, SATA SSD, and mechanical HDDs with their SMART status.',
      perm: 'Standard User'
    },
    {
      title: 'RAM Memory Modules & Clock Speeds',
      syntax: 'Get-CimInstance Win32_PhysicalMemory | Select-Object Manufacturer, Capacity, Speed, MemoryType, PartNumber',
      desc: 'Queries physical RAM sticks, capacity per slot, and configured clock frequencies.',
      perm: 'Standard User'
    },
    {
      title: 'Motherboard Model & Serial Number',
      syntax: 'wmic baseboard get product,manufacturer,version,serialnumber',
      desc: 'Retrieves motherboard model and OEM serial number for warranty or driver lookup.',
      perm: 'Standard User'
    },
    {
      title: 'Battery Health Report Generation',
      syntax: 'powercfg /batteryreport /output "C:\\battery-report.html"',
      desc: 'Generates an exhaustive HTML battery discharge, wear level, and capacity history report.',
      perm: 'Administrator'
    }
  ];

  const handleCopy = async (cmd) => {
    const ok = await copyToClipboard(cmd);
    if (ok) {
      setCopiedCmd(cmd);
      setToast({ type: 'success', message: 'Hardware command copied!' });
      setTimeout(() => setCopiedCmd(''), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-amber-500" />
          Hardware Diagnostics & Spec Auditing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          WMI and CIM queries for storage SMART integrity, memory specs, battery reports, and motherboard info.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {commands.map((cmd) => (
          <div key={cmd.title} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">{cmd.title}</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {cmd.perm}
              </span>
            </div>
            <div className="relative">
              <div className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                <code>{cmd.syntax}</code>
              </div>
              <button
                onClick={() => handleCopy(cmd.syntax)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white transition shadow"
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
