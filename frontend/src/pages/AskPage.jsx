import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  BookOpen,
  Clock,
  Copy,
  Gauge,
  Loader2,
  Send,
  Sparkles,
  Terminal,
  Wand2,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import RiskBadge from '../components/common/RiskBadge';
import CommandDetailsModal from '../components/commands/CommandDetailsModal';
import GuideModal from '../components/guides/GuideModal';
import Toast from '../components/common/Toast';
import { assistantApi } from '../api/assistantApi';
import { copyToClipboard } from '../utils/copyToClipboard';
import { askLlm, isAiConfigured } from '../utils/aiClient';

const EXAMPLES = [
  'wifi keeps disconnecting',
  'blue screen after Windows update',
  'printer queue is stuck',
  'dns is not resolving',
  'disk is almost full',
];

export default function AskPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuestion = searchParams.get('q') || '';

  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedGuide, setSelectedGuide] = useState(null);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [toast, setToast] = useState(null);

  const [llmAnswer, setLlmAnswer] = useState('');
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState(null);

  const autoRan = useRef(false);
  const aiReady = isAiConfigured();

  const runAsk = useCallback(async (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setAnswer(null);
    setLlmAnswer('');
    setLlmError(null);

    try {
      const res = await assistantApi.ask(trimmed);
      setAnswer(res?.data || null);
    } catch (err) {
      setError(err?.message || 'The assistant is not reachable.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuestion && !autoRan.current) {
      autoRan.current = true;
      runAsk(initialQuestion);
    }
  }, [initialQuestion, runAsk]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    setSearchParams({ q: trimmed });
    runAsk(trimmed);
  };

  const handleExample = (example) => {
    setQuestion(example);
    setSearchParams({ q: example });
    runAsk(example);
  };

  const handleCopy = async (command) => {
    const ok = await copyToClipboard(command.commandSyntax);
    setToast({
      type: ok ? 'success' : 'error',
      message: ok ? `Copied: ${command.name}` : 'Could not copy to clipboard.',
    });
    setTimeout(() => setToast(null), 2500);
  };

  const handleLlm = async () => {
    if (!answer) return;

    const context = [
      ...(answer.guides || []).map((guide) =>
        `GUIDE: ${guide.title} — ${guide.description} Symptoms: ${guide.symptoms || 'n/a'}`),
      ...(answer.commands || []).map((command) =>
        `COMMAND: ${command.name} (${command.riskLevel}, ${command.requiredPermissions}) — ${command.commandSyntax}. Purpose: ${command.purpose}. When: ${command.whenToUse || 'n/a'}`),
    ].join('\n');

    setLlmLoading(true);
    setLlmError(null);
    setLlmAnswer('');

    try {
      const text = await askLlm({ question: answer.query, context });
      setLlmAnswer(text);
    } catch (err) {
      setLlmError(err?.message || 'The model request failed.');
    } finally {
      setLlmLoading(false);
    }
  };

  const hasResults = Boolean(answer?.commands?.length || answer?.guides?.length);

  return (
    <div className="space-y-7 animate-fade-in">
      <PageHeader
        icon={Sparkles}
        title="Ask AI"
        description="Describe the problem in plain language. The assistant searches your own command and guide library and shows why each result matched."
        meta={
          <span className="chip chip-active">
            <Sparkles className="h-3 w-3" />
            Knowledge-base mode
          </span>
        }
      />

      <form onSubmit={handleSubmit} className="surface p-5">
        <label htmlFor="problem" className="label">What is happening?</label>
        <textarea
          id="problem"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={3}
          placeholder="Example: my laptop connects to Wi-Fi but pages never load, and ping to 8.8.8.8 works"
          className="input mt-2 resize-none"
        />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => handleExample(example)}
                className="chip transition hover:border-sky-500/40 hover:text-sky-300"
              >
                {example}
              </button>
            ))}
          </div>
          <button type="submit" disabled={loading || !question.trim()} className="btn-primary shrink-0">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {loading ? 'Searching…' : 'Find a fix'}
          </button>
        </div>
      </form>

      {error && (
        <EmptyState
          tone="error"
          title="Assistant unavailable"
          description={`${error} Check that the backend is running on port 8080.`}
          action={<button onClick={() => runAsk(question)} className="btn-ghost px-3.5 py-2 text-xs">Retry</button>}
        />
      )}

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-[#111a2b]" />
          ))}
        </div>
      )}

      {!loading && answer && (
        <div className="space-y-6">
          <div className="surface p-4">
            <p className="text-sm text-slate-300">{answer.summary}</p>
            {answer.matchedTerms?.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-500">Matched terms:</span>
                {answer.matchedTerms.map((term) => (
                  <span key={term} className="chip">{term}</span>
                ))}
              </div>
            )}
          </div>

          {answer.guides?.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
                <BookOpen className="h-4 w-4 text-sky-400" />
                Recommended guides
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {answer.guides.map((guide) => (
                  <button
                    key={guide.id}
                    onClick={() => setSelectedGuide(guide.id)}
                    className="surface p-4 text-left transition hover:border-sky-500/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-100">{guide.title}</h3>
                      <span className="shrink-0 text-xs font-semibold text-sky-400">{guide.score}%</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-400">{guide.description}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="chip"><Gauge className="h-3 w-3" />{guide.difficulty}</span>
                      <span className="chip"><Clock className="h-3 w-3" />{guide.estimatedTimeMinutes} min</span>
                      <span className="truncate">{guide.why}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {answer.commands?.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Terminal className="h-4 w-4 text-emerald-400" />
                Matching commands
              </h2>
              <div className="space-y-2.5">
                {answer.commands.map((command) => (
                  <article key={command.id} className="surface p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-slate-100">{command.name}</h3>
                        <RiskBadge level={command.riskLevel} />
                      </div>
                      <span className="text-xs font-semibold text-sky-400">{command.score}%</span>
                    </div>

                    <p className="mt-1 text-sm text-slate-400">{command.purpose}</p>

                    <div className="relative mt-2.5">
                      <pre className="mono overflow-x-auto rounded-lg border border-[#1f2b45] bg-[#080e19] px-3 py-2.5 pr-24 text-xs text-sky-200">
                        <code>{command.commandSyntax}</code>
                      </pre>
                      <div className="absolute right-2 top-2 flex gap-1.5">
                        <button
                          onClick={() => handleCopy(command)}
                          className="rounded-md border border-[#26334f] bg-[#0d1524] p-1.5 text-slate-400 hover:text-sky-300"
                          title="Copy command"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedCommand(command)}
                          className="rounded-md border border-[#26334f] bg-[#0d1524] px-2 py-1 text-[11px] font-semibold text-slate-300 hover:text-white"
                        >
                          Details
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                      <span>{command.requiredPermissions}</span>
                      <span className="text-slate-600">·</span>
                      <span>{command.categoryName}</span>
                      <span className="text-slate-600">·</span>
                      <span className="truncate">{command.why}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {!hasResults && answer.suggestions?.length > 0 && (
            <EmptyState
              title="No library match"
              description="Try one of these topics, or rephrase the symptom the way a technician would describe it."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  {answer.suggestions.slice(0, 6).map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleExample(suggestion)}
                      className="chip transition hover:border-sky-500/40 hover:text-sky-300"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              }
            />
          )}

          {/* Optional LLM layer */}
          <section className="surface p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                <Wand2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-slate-100">Conversational explanation</h2>
                {aiReady ? (
                  <p className="mt-1 text-sm text-slate-400">
                    Send this problem and the matched library entries to your configured model for a tailored walkthrough.
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-slate-400">
                    Optional. Add an OpenAI-compatible API key in Settings to get a conversational answer on top of the
                    knowledge-base results. The assistant above works without it.
                  </p>
                )}

                {aiReady && (
                  <button onClick={handleLlm} disabled={llmLoading} className="btn-ghost mt-3 px-3.5 py-2 text-xs">
                    {llmLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                    {llmLoading ? 'Asking model…' : 'Ask the model'}
                  </button>
                )}

                {llmError && (
                  <p className="mt-3 flex items-start gap-2 rounded-lg border border-rose-500/25 bg-rose-500/5 p-3 text-xs text-rose-200">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {llmError}
                  </p>
                )}

                {llmAnswer && (
                  <div className="mt-3 whitespace-pre-wrap rounded-xl border border-[#26334f] bg-[#0b1322] p-3.5 text-sm leading-relaxed text-slate-300">
                    {llmAnswer}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {!loading && !answer && !error && (
        <div className="grid gap-3 md:grid-cols-3">
          <div className="surface p-4">
            <h3 className="text-sm font-semibold text-slate-200">1. Describe the symptom</h3>
            <p className="mt-1 text-sm text-slate-400">Use plain language. Mention error codes, timing and what changed.</p>
          </div>
          <div className="surface p-4">
            <h3 className="text-sm font-semibold text-slate-200">2. Read the matches</h3>
            <p className="mt-1 text-sm text-slate-400">Each result shows its match score, risk level and why it was selected.</p>
          </div>
          <div className="surface p-4">
            <h3 className="text-sm font-semibold text-slate-200">3. Verify, then run</h3>
            <p className="mt-1 text-sm text-slate-400">Copy the command and run it yourself. The UI never executes anything.</p>
          </div>
        </div>
      )}

      {selectedGuide && <GuideModal guideId={selectedGuide} onClose={() => setSelectedGuide(null)} />}
      {selectedCommand && <CommandDetailsModal command={selectedCommand} onClose={() => setSelectedCommand(null)} />}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
