import React, { useState } from 'react';
import { Copy, Check, Terminal, ArrowUpRight, Shield } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';
import { copyToClipboard } from '../../utils/copyToClipboard';

export default function CommandCard({ command, onViewDetails, onCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (event) => {
    event.stopPropagation();
    const success = await copyToClipboard(command.commandSyntax);
    if (success) {
      setCopied(true);
      if (onCopy) onCopy(command);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article
      onClick={() => onViewDetails(command)}
      className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-[#1f2b45] bg-[#111a2b] p-5 transition hover:border-sky-500/40 hover:bg-[#131e33]"
    >
      <div>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
              <Terminal className="h-4 w-4" />
            </div>
            <h3 className="truncate text-sm font-semibold text-slate-100 group-hover:text-white">
              {command.name}
            </h3>
          </div>
          <RiskBadge level={command.riskLevel} />
        </div>

        <div className="relative mb-3">
          <pre className="mono overflow-x-auto rounded-xl border border-[#1f2b45] bg-[#080e19] px-3 py-2.5 pr-11 text-xs text-sky-200">
            <code>{command.commandSyntax}</code>
          </pre>
          <button
            onClick={handleCopy}
            title="Copy command"
            className="absolute right-2 top-2 rounded-lg border border-[#26334f] bg-[#0d1524] p-1.5 text-slate-400 transition hover:border-sky-500/40 hover:text-sky-300"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-slate-400">{command.explanation}</p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#1b2740] pt-3 text-xs text-slate-500">
        <span className="flex min-w-0 items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{command.requiredPermissions}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-sky-400 group-hover:text-sky-300">
          Details
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </article>
  );
}
