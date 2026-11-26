import React, { useState } from 'react';
import { Users, Building, Phone, Mail, Monitor, Plus, Search } from 'lucide-react';

const sampleCustomers = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    company: 'Apex Logistics LLC',
    email: 'sjenkins@apexlogistics.com',
    phone: '+1 (555) 234-5678',
    address: '450 Harbor Blvd, Suite 200, Seattle, WA',
    deviceCount: 2,
    activeTickets: 1,
    devices: [
      { name: 'APEX-WS-04', type: 'DESKTOP', os: 'Windows 11 Pro 23H2', ip: '192.168.10.45' },
      { name: 'APEX-PRN-01', type: 'PRINTER', os: 'Firmware 4.2', ip: '192.168.10.200' }
    ]
  },
  {
    id: 2,
    name: 'Marcus Vance',
    company: 'Vance Accounting Services',
    email: 'marcus@vancecpa.com',
    phone: '+1 (555) 876-5432',
    address: '120 Pine Street, Floor 4, Portland, OR',
    deviceCount: 1,
    activeTickets: 1,
    devices: [
      { name: 'VANCE-LT-01', type: 'LAPTOP', os: 'Windows 11 Pro 23H2', ip: '192.168.1.112' }
    ]
  }
];

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState(sampleCustomers);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            Customers & Managed Devices
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain customer records, office workstations, assigned peripherals, and repair profiles.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer name, company, or email..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((c) => (
          <div key={c.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
                <p className="text-xs font-semibold text-blue-600 flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5" />
                  {c.company}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {c.activeTickets} Active Ticket
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {c.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {c.phone}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Registered Devices ({c.devices.length})
              </h4>
              <div className="space-y-2">
                {c.devices.map((d) => (
                  <div key={d.name} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="font-bold text-slate-800">{d.name}</p>
                        <p className="text-[10px] text-slate-500">{d.os}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {d.ip}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
