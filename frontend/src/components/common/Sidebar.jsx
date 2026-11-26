import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Terminal,
  Activity,
  BookOpen,
  Settings,
  Zap,
} from 'lucide-react';
import { useBackendHealth } from '../../hooks/useBackendHealth';

const NAV = [
  { group: 'Overview', items: [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, end: true },
  ]},
  { group: 'Workspace', items: [
    { name: 'Ask AI', path: '/ask', icon: Sparkles },
    { name: 'Toolkit', path: '/toolkit', icon: Terminal },
    { name: 'Diagnostics', path: '/diagnostics', icon: Activity },
    { name: 'Guides', path: '/guides', icon: BookOpen },
  ]},
  { group: 'System', items: [
    { name: 'Settings', path: '/settings', icon: Settings },
  ]},
];

function BackendStatus() {
  const { online, score } = useBackendHealth();

  const dot = online === null
    ? 'bg-slate-500'
    : online
      ? 'bg-emerald-400'
      : 'bg-rose-400';

  const label = online === null
    ? 'Checking backend…'
    : online
      ? `Backend online${score !== null ? ` · ${score}/100` : ''}`
      : 'Backend offline';

  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#1f2b45] bg-[#0d1524] px-3 py-2.5">
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot} ${online ? 'animate-pulse' : ''}`} />
      <span className="truncate text-xs text-slate-400">{label}</span>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-full shrink-0 border-b border-[#1f2b45] bg-[#0b1322] lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 border-b border-[#1f2b45] px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-slate-950">
          <Zap className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold tracking-tight text-white">TechFix</span>
            <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-bold text-sky-300">PRO</span>
          </div>
          <p className="truncate text-[11px] text-slate-500">IT technician toolkit</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:gap-5 lg:overflow-visible">
        {NAV.map((section) => (
          <div key={section.group} className="flex gap-1 lg:flex-col lg:gap-1">
            <p className="hidden px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600 lg:block">
              {section.group}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-sky-500/12 text-sky-300'
                        : 'text-slate-400 hover:bg-[#131e33] hover:text-slate-100'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="whitespace-nowrap">{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="hidden border-t border-[#1f2b45] p-3 lg:block">
        <BackendStatus />
        <p className="mt-2 px-1 text-[10px] leading-relaxed text-slate-600">
          Read-only diagnostics. Commands are copy-only.
        </p>
      </div>
    </aside>
  );
}
