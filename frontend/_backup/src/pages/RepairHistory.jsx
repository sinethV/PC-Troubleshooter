import React from 'react';
import { History, Wrench, Terminal, CheckCircle2, Calendar } from 'lucide-react';

const sampleRepairs = [
  {
    id: 1,
    ticket: 'TICK-2026-001',
    tech: 'Alex Mercer',
    date: 'November 22, 2026',
    action: 'Scanned and repaired operating system image corruption and verified NTFS file system integrity.',
    commands: 'DISM /Online /Cleanup-Image /RestoreHealth; sfc /scannow; chkdsk C: /f',
    notes: 'Advised client to maintain at least 20% free space on drive C: to ensure Windows staging files do not fragment.'
  },
  {
    id: 2,
    ticket: 'TICK-2026-002',
    tech: 'John Doe',
    date: 'November 23, 2026',
    action: 'Cleared stuck spooler files and reset print service queue.',
    commands: 'net stop spooler && del /Q /F /S "%systemroot%\\System32\\Spool\\Printers\\*.*" && net start spooler',
    notes: 'Reminded warehouse dispatch team to not unplug printer USB mid-print run.'
  }
];

export default function RepairHistory() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <History className="w-6 h-6 text-slate-700" />
          Technician Repair & Service History
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Historical log of executed commands, remediations, hardware component changes, and technician diagnostic notes.
        </p>
      </div>

      <div className="space-y-4">
        {sampleRepairs.map((r) => (
          <div key={r.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                  {r.ticket}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-700">Technician: {r.tech}</span>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {r.date}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-800">{r.action}</p>

            <div className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
              <code>{r.commands}</code>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
              <strong className="text-slate-800">Technician Notes: </strong>
              {r.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
