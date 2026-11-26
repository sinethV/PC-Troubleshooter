import React from 'react';
import { percent } from '../../utils/format';

const TONE_BY_VALUE = (value) => {
  if (value >= 95) return 'bg-rose-500';
  if (value >= 85) return 'bg-amber-400';
  if (value >= 70) return 'bg-sky-400';
  return 'bg-emerald-400';
};

export default function ProgressBar({ value, label, valueText, tone, size = 'md' }) {
  const safe = percent(value);
  const barTone = tone || TONE_BY_VALUE(safe);

  return (
    <div>
      {(label || valueText) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          {label && <span className="text-sm text-slate-300">{label}</span>}
          {valueText && <span className="mono text-xs text-slate-400">{valueText}</span>}
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-[#0a1220] ${size === 'sm' ? 'h-1.5' : 'h-2'}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${barTone}`}
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}
