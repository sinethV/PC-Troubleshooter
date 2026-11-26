import React, { useState } from 'react';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  PlugZap,
  Save,
  Server,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { clearAiConfig, getAiConfig, saveAiConfig } from '../utils/aiClient';
import { useBackendHealth } from '../hooks/useBackendHealth';
import { formatDateTime } from '../utils/format';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export default function SettingsPage() {
  const stored = getAiConfig();
  const [baseUrl, setBaseUrl] = useState(stored.baseUrl);
  const [model, setModel] = useState(stored.model);
  const [apiKey, setApiKey] = useState(stored.apiKey);
  const [showKey, setShowKey] = useState(false);

  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const { online, score, status, checkedAt } = useBackendHealth(30000);

  const handleSave = (event) => {
    event.preventDefault();
    saveAiConfig({ baseUrl: baseUrl.trim(), model: model.trim(), apiKey: apiKey.trim() });
    setSaved(true);
    setTestResult(null);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClear = () => {
    clearAiConfig();
    const defaults = getAiConfig();
    setBaseUrl(defaults.baseUrl);
    setModel(defaults.model);
    setApiKey('');
    setTestResult(null);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/models`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (response.ok) {
        setTestResult({ ok: true, message: 'Connected. The provider answered successfully.' });
      } else {
        setTestResult({
          ok: false,
          message: `Provider answered ${response.status}. Check the base URL, model and key. Some providers do not expose /models.`,
        });
      }
    } catch (err) {
      setTestResult({
        ok: false,
        message: `${err.message}. This is often a CORS block; the provider must allow browser requests.`,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        icon={Server}
        title="Settings"
        description="Connection details, the optional AI model, and the safety policy this toolkit follows."
      />

      {/* Backend connection */}
      <section className="surface p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <PlugZap className="h-4 w-4 text-sky-400" /> Backend connection
          </h2>
          <span className={`chip ${online ? 'border-emerald-500/30 text-emerald-300' : 'border-rose-500/30 text-rose-300'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            {online === null ? 'checking' : online ? `online · ${score}/100` : 'offline'}
          </span>
        </div>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="label">API base URL</dt>
            <dd className="mono mt-1 rounded-lg border border-[#26334f] bg-[#0b1322] px-3 py-2 text-xs text-slate-300">
              {API_BASE.startsWith('http') ? API_BASE : `http://localhost:8080${API_BASE}`}
            </dd>
          </div>
          <div>
            <dt className="label">Database</dt>
            <dd className="mono mt-1 rounded-lg border border-[#26334f] bg-[#0b1322] px-3 py-2 text-xs text-slate-300">
              PostgreSQL · techfix_pro
            </dd>
          </div>
        </dl>

        <p className="mt-3 text-xs text-slate-500">
          Last check: {checkedAt ? formatDateTime(checkedAt) : '—'}
          {status ? ` · health status ${status}` : ''}
        </p>
      </section>

      {/* AI assistant */}
      <section className="surface p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">AI assistant (optional)</h2>
            <p className="mt-1 text-sm text-slate-400">
              The Ask AI page works without a model by searching your own library. Add an OpenAI-compatible
              endpoint here to enable conversational explanations.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="baseUrl" className="label">Base URL</label>
            <input
              id="baseUrl"
              type="url"
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
              placeholder="https://api.openai.com/v1"
              className="input mt-1.5"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Must be OpenAI-compatible. Examples: https://api.openai.com/v1, https://api.deepseek.com/v1,
              https://openrouter.ai/api/v1.
            </p>
          </div>

          <div>
            <label htmlFor="model" className="label">Model</label>
            <input
              id="model"
              type="text"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              placeholder="gpt-4o-mini"
              className="input mt-1.5"
            />
          </div>

          <div>
            <label htmlFor="apiKey" className="label">API key</label>
            <div className="relative mt-1.5">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="sk-…"
                autoComplete="off"
                className="input pl-9 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey((value) => !value)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-200"
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
            <button type="submit" className="btn-primary px-3.5 py-2 text-xs">
              <Save className="h-3.5 w-3.5" /> Save
            </button>
            <button type="button" onClick={handleTest} disabled={testing || !apiKey} className="btn-ghost px-3.5 py-2 text-xs">
              {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlugZap className="h-3.5 w-3.5" />}
              Test connection
            </button>
            <button type="button" onClick={handleClear} className="btn-ghost px-3.5 py-2 text-xs text-rose-300 hover:border-rose-500/40">
              <Trash2 className="h-3.5 w-3.5" /> Clear key
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved on this device
              </span>
            )}
          </div>
        </form>

        {testResult && (
          <p className={`mt-3 flex items-start gap-2 rounded-lg border p-3 text-xs ${
            testResult.ok
              ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-200'
              : 'border-amber-500/25 bg-amber-500/5 text-amber-200'
          }`}>
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {testResult.message}
          </p>
        )}

        <p className="mt-4 flex items-start gap-2 rounded-lg border border-[#26334f] bg-[#0d1524] p-3 text-[11px] leading-relaxed text-slate-500">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
          The key is stored only in this browser's localStorage and is sent directly to the provider you configure.
          It never reaches the TechFix backend. Use a scoped key and clear it when you are done.
        </p>
      </section>

      {/* Safety */}
      <section className="surface p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <ShieldCheck className="h-4 w-4 text-emerald-400" /> Safety policy
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-400">
          <li className="flex gap-2">
            <span className="text-emerald-400">•</span>
            Commands are copy-only. The web UI never executes anything on the host.
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-400">•</span>
            Diagnostics use read-only JVM and OS APIs. No shell commands, no elevation.
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-400">•</span>
            Risk level and required permissions are shown before any command is copied.
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-400">•</span>
            Assistant answers come from your library; if nothing matches, it says so instead of guessing.
          </li>
        </ul>
      </section>

      <p className="text-xs text-slate-600">
        TechFix Pro 2.0 · React 18 + Vite · Spring Boot 3.3 · PostgreSQL
      </p>
    </div>
  );
}
