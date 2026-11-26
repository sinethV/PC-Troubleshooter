import React from 'react';
import { Inbox, AlertTriangle, ServerCrash } from 'lucide-react';

const TONES = {
  info: {
    icon: Inbox,
    ring: 'border-[#26334f] bg-[#0d1524]',
    iconColor: 'text-slate-400',
  },
  warn: {
    icon: AlertTriangle,
    ring: 'border-amber-500/25 bg-amber-500/5',
    iconColor: 'text-amber-400',
  },
  error: {
    icon: ServerCrash,
    ring: 'border-rose-500/25 bg-rose-500/5',
    iconColor: 'text-rose-400',
  },
};

export default function EmptyState({ title, description, action, tone = 'info', compact = false }) {
  const { icon: Icon, ring, iconColor } = TONES[tone] || TONES.info;

  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border text-center ${ring} ${compact ? 'px-5 py-8' : 'px-6 py-14'}`}>
      <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[#26334f] bg-[#0b1322] ${iconColor}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      {description && <p className="mt-1.5 max-w-md text-sm text-slate-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
