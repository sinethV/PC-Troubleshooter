import React from 'react';
import { scoreStroke } from '../../utils/format';

export default function ScoreRing({ score = 0, size = 132, label, sublabel }) {
  const safe = Math.max(0, Math.min(100, Number(score) || 0));
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safe / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a2740"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreStroke(safe)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{Math.round(safe)}</span>
        {label && <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{label}</span>}
        {sublabel && <span className="mt-0.5 text-xs text-slate-500">{sublabel}</span>}
      </div>
    </div>
  );
}
