import React, { useState } from 'react';
import { Copy, Check, Terminal, ShieldAlert, CircleCheck, Info } from 'lucide-react';
import Modal from '../ui/Modal';
import RiskBadge from '../common/RiskBadge';
import { copyToClipboard } from '../../utils/copyToClipboard';

export default function CommandDetailsModal({ command, onClose, onCopy }) {
  const [copied, setCopied] = useState(false);

  if (!command) return null;

  const handleCopy = async () => {
    const success = await copyToClipboard(command.commandSyntax);
    if (success) {
      setCopied(true);
      if (onCopy) onCopy(command);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      icon={Terminal}
      title={command.name}
      subtitle={command.categoryName || 'General'}
      footer={
        <>
          <span className="text-xs text-slate-500">
            Review the risk level before running anything.
          </span>
          <button onClick={onClose} className="btn-ghost px-3.5 py-2 text-xs">
            Close
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="label">Command syntax</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#26334f] px-2.5 py-1 text-xs font-semibold text-slate-300 transition hover:border-sky-500/40 hover:text-sky-300"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="mono overflow-x-auto rounded-xl border border-[#1f2b45] bg-[#080e19] px-3.5 py-3 text-sm text-sky-200">
            <code>{command.commandSyntax}</code>
          </pre>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="surface-2 p-3">
            <span className="label">Risk</span>
            <div className="mt-1.5"><RiskBadge level={command.riskLevel} /></div>
          </div>
          <div className="surface-2 p-3">
            <span className="label">Permissions</span>
            <p className="mt-1 text-xs font-semibold text-slate-200">{command.requiredPermissions}</p>
          </div>
          <div className="surface-2 col-span-2 p-3 sm:col-span-1">
            <span className="label">Module</span>
            <p className="mt-1 truncate text-xs font-semibold text-sky-300">{command.categoryName}</p>
          </div>
        </div>

        <section>
          <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-100">
            <Info className="h-4 w-4 text-sky-400" />
            What it does
          </h3>
          <p className="surface-2 p-3.5 text-sm leading-relaxed text-slate-300">{command.explanation}</p>
        </section>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
            <h4 className="label text-sky-300">Purpose</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{command.purpose}</p>
          </div>
          <div className="surface-2 p-4">
            <h4 className="label">When to use</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
              {command.whenToUse || 'During general diagnostic triage.'}
            </p>
          </div>
        </div>

        {command.expectedOutput && (
          <section>
            <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-100">
              <CircleCheck className="h-4 w-4 text-emerald-400" />
              Expected output
            </h3>
            <pre className="mono whitespace-pre-wrap rounded-xl border border-[#1f2b45] bg-[#0b1322] p-3 text-xs text-slate-300">
              {command.expectedOutput}
            </pre>
          </section>
        )}

        {command.verificationInstructions && (
          <section>
            <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-100">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              Verification and next steps
            </h3>
            <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm leading-relaxed text-slate-300">
              {command.verificationInstructions}
            </p>
          </section>
        )}
      </div>
    </Modal>
  );
}
