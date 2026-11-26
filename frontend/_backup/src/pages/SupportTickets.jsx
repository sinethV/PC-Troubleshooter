import React, { useState } from 'react';
import { Ticket, Clock, CheckCircle2, AlertCircle, Search, User } from 'lucide-react';

const sampleTickets = [
  {
    number: 'TICK-2026-001',
    customer: 'Sarah Jenkins (Apex Logistics)',
    device: 'APEX-WS-04 (Desktop)',
    title: 'Windows 11 BSOD on Startup (CRITICAL_PROCESS_DIED)',
    priority: 'HIGH',
    status: 'RESOLVED',
    date: '2026-11-22',
    tech: 'Alex Mercer'
  },
  {
    number: 'TICK-2026-002',
    customer: 'Sarah Jenkins (Apex Logistics)',
    device: 'APEX-PRN-01 (LaserJet)',
    title: 'Main Dispatch Printer Offline and Queue Stalled',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    date: '2026-11-23',
    tech: 'John Doe'
  },
  {
    number: 'TICK-2026-003',
    customer: 'Marcus Vance (Vance Accounting)',
    device: 'VANCE-LT-01 (Laptop)',
    title: 'Intermittent Wi-Fi Disconnection & DNS Failure',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    date: '2026-11-24',
    tech: 'Alex Mercer'
  }
];

export default function SupportTickets() {
  const [tickets] = useState(sampleTickets);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Ticket className="w-6 h-6 text-amber-500" />
            Helpdesk Support Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track reported IT issues, associate affected client hardware, and manage service lifecycles.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Ticket #</th>
                <th className="px-6 py-3.5">Customer & Device</th>
                <th className="px-6 py-3.5">Issue Title</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Assigned Tech</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((t) => (
                <tr key={t.number} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600">
                    {t.number}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{t.customer}</p>
                    <p className="text-[11px] text-slate-500">{t.device}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800 max-w-xs">
                    {t.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.priority === 'HIGH'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'RESOLVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {t.status === 'RESOLVED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {t.tech}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
