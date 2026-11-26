import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, Flame } from 'lucide-react';

const STYLES = {
  SAFE: {
    icon: ShieldCheck,
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    label: 'Safe',
  },
  MODERATE: {
    icon: AlertTriangle,
    className: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    label: 'Moderate',
  },
  HIGH: {
    icon: AlertCircle,
    className: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
    label: 'High risk',
  },
  DANGEROUS: {
    icon: Flame,
    className: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    label: 'Dangerous',
  },
};

export default function RiskBadge({ level }) {
  const key = (level || 'SAFE').toUpperCase();
  const style = STYLES[key] || {
    icon: ShieldCheck,
    className: 'border-[#26334f] bg-[#0d1524] text-slate-300',
    label: level || 'Unknown',
  };
  const Icon = style.icon;

  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${style.className}`}>
      <Icon className="h-3 w-3" />
      {style.label}
    </span>
  );
}
