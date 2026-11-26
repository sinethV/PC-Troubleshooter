import React, { useEffect, useState } from 'react';
import { BookOpen, Copy, Check, Clock, Gauge, AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal';
import EmptyState from '../ui/EmptyState';
import { guideApi } from '../../api/guideApi';
import { copyToClipboard } from '../../utils/copyToClipboard';

function StepCommand({ syntax }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(syntax);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative mt-2">
      <pre className="mono overflow-x-auto rounded-lg border border-[#1f2b45] bg-[#080e19] px-3 py-2.5 pr-10 text-xs text-sky-200">
        <code>{syntax}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded-md border border-[#26334f] bg-[#0d1524] p-1.5 text-slate-400 hover:text-sky-300"
        title="Copy command"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

export default function GuideModal({ guideId, onClose }) {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!guideId) return;
    let active = true;

    setLoading(true);
    setError(null);

    guideApi.getById(guideId)
      .then((res) => {
        if (active) setGuide(res?.data || null);
      })
      .catch((err) => {
        if (active) setError(err?.message || 'Could not load this guide.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [guideId]);

  return (
    <Modal
      open={Boolean(guideId)}
      onClose={onClose}
      icon={BookOpen}
      title={guide?.title || 'Troubleshooting guide'}
      subtitle={guide ? `${guide.categoryName} · ${guide.targetOs}` : 'Loading…'}
      width="max-w-3xl"
      footer={
        <>
          <span className="text-xs text-slate-500">
            {guide?.steps?.length || 0} steps
          </span>
          <button onClick={onClose} className="btn-ghost px-3.5 py-2 text-xs">Close</button>
        </>
      }
    >
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-[#0d1524]" />
          ))}
        </div>
      )}

      {!loading && error && (
        <EmptyState tone="error" title="Guide unavailable" description={error} compact />
      )}

      {!loading && !error && guide && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip"><Gauge className="h-3 w-3" />{guide.difficulty}</span>
            <span className="chip"><Clock className="h-3 w-3" />{guide.estimatedTimeMinutes} min</span>
            <span className="chip">{guide.categoryName}</span>
          </div>

          <p className="text-sm leading-relaxed text-slate-300">{guide.description}</p>

          {guide.symptoms && (
            <div className="rounded-xl border border-[#26334f] bg-[#0d1524] p-3.5">
              <span className="label">Symptoms</span>
              <p className="mt-1 text-sm text-slate-400">{guide.symptoms}</p>
            </div>
          )}

          <ol className="space-y-4">
            {guide.steps?.map((step) => (
              <li key={step.id || step.stepNumber} className="rounded-xl border border-[#1f2b45] bg-[#111a2b] p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-xs font-bold text-sky-300">
                    {step.stepNumber}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-slate-100">{step.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">{step.instruction}</p>

                    {step.commandSyntax && <StepCommand syntax={step.commandSyntax} />}

                    {step.warningNote && (
                      <p className="mt-2 flex items-start gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2 text-xs text-amber-200">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {step.warningNote}
                      </p>
                    )}

                    {step.expectedResult && (
                      <p className="mt-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-400">Expected:</span> {step.expectedResult}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Modal>
  );
}
