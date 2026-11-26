import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CircleCheck,
  CircleHelp,
  ClipboardCopy,
  Clock,
  HardDrive,
  Network,
  RefreshCw,
  Server,
  XCircle,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import ProgressBar from '../components/ui/ProgressBar';
import ScoreRing from '../components/ui/ScoreRing';
import Toast from '../components/common/Toast';
import { systemApi } from '../api/systemApi';
import { copyToClipboard } from '../utils/copyToClipboard';
import { formatBytes, formatDateTime, formatUptime } from '../utils/format';

const CHECK_STYLE = {
  OK: { icon: CircleCheck, className: 'text-emerald-400', border: 'border-emerald-500/25' },
  WARN: { icon: AlertTriangle, className: 'text-amber-400', border: 'border-amber-500/25' },
  CRITICAL: { icon: XCircle, className: 'text-rose-400', border: 'border-rose-500/25' },
  UNKNOWN: { icon: CircleHelp, className: 'text-slate-500', border: 'border-[#26334f]' },
};

function Detail({ label, value, mono = false }) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className={`mt-0.5 text-sm text-slate-200 ${mono ? 'mono text-[13px]' : ''}`}>{value ?? '—'}</dd>
    </div>
  );
}

export default function DiagnosticsPage() {
  const [info, setInfo] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showAllAdapters, setShowAllAdapters] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const [infoRes, healthRes] = await Promise.all([
        systemApi.getInfo(),
        systemApi.getHealth(),
      ]);
      setInfo(infoRes?.data || null);
      setHealth(healthRes?.data || null);
      setError(null);
      setUpdatedAt(new Date());
    } catch (err) {
      setError(err?.message || 'Could not read system information.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(true);
  }, [load]);

  useEffect(() => {
    if (!autoRefresh) return undefined;
    const timer = setInterval(() => load(false), 10000);
    return () => clearInterval(timer);
  }, [autoRefresh, load]);

  const buildReport = () => {
    const lines = [
      '# TechFix Pro — System report',
      `Captured: ${formatDateTime(new Date())}`,
      '',
      '## Host',
      `Hostname: ${info?.hostname || 'unknown'}`,
      `OS: ${info?.osName} ${info?.osVersion} (${info?.osArch})`,
      `CPU: ${info?.cpu?.model} — ${info?.cpu?.logicalProcessors} logical processors`,
      `CPU load: ${info?.cpu?.loadPercent >= 0 ? `${info.cpu.loadPercent}%` : 'not exposed'}`,
      `Memory: ${formatBytes(info?.memory?.usedBytes)} / ${formatBytes(info?.memory?.totalBytes)} (${info?.memory?.usedPercent}%)`,
      `Backend uptime: ${formatUptime(info?.uptimeSeconds)}`,
      `Java: ${info?.javaVersion}`,
      '',
      '## Health',
      `Overall: ${health?.overallScore}/100 (${health?.status})`,
      ...(health?.checks || []).map((check) => `- ${check.label}: ${check.status} — ${check.value} (${check.detail})`),
      '',
      '## Volumes',
      ...(info?.disks || []).map((disk) =>
        `- ${disk.name}: ${formatBytes(disk.usableBytes)} free of ${formatBytes(disk.totalBytes)} (${disk.usedPercent}% used)`),
      '',
      '## Network',
      ...(info?.network || []).map((adapter) =>
        `- ${adapter.displayName} [${adapter.name}] ${adapter.up ? 'up' : 'down'} ${adapter.ipv4?.join(', ') || 'no IPv4'} ${adapter.macAddress || ''}`),
    ];
    return lines.join('\n');
  };

  const visibleAdapters = (info?.network || []).filter(
    (adapter) => showAllAdapters || (adapter.up && !adapter.loopback)
  );

  const handleCopyReport = async () => {
    const ok = await copyToClipboard(buildReport());
    setToast({
      type: ok ? 'success' : 'error',
      message: ok ? 'System report copied as Markdown.' : 'Could not copy the report.',
    });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        icon={Activity}
        title="Diagnostics"
        description="Live read-only metrics from the machine running the backend. No simulated values, no shell commands."
        meta={
          <span className="text-xs text-slate-500">
            {updatedAt ? `Updated ${formatDateTime(updatedAt)}` : 'Loading…'}
          </span>
        }
        actions={
          <>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#26334f] px-3 py-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(event) => setAutoRefresh(event.target.checked)}
                className="h-3.5 w-3.5 accent-sky-500"
              />
              Auto 10s
            </label>
            <button onClick={() => load(true)} disabled={loading} className="btn-ghost px-3.5 py-2 text-xs">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={handleCopyReport} disabled={!info} className="btn-primary px-3.5 py-2 text-xs">
              <ClipboardCopy className="h-3.5 w-3.5" /> Copy report
            </button>
          </>
        }
      />

      {error && (
        <EmptyState
          tone="error"
          title="System information unavailable"
          description={`${error} Start the backend on port 8080 to read live metrics.`}
          action={<button onClick={() => load(true)} className="btn-ghost px-3.5 py-2 text-xs">Retry</button>}
        />
      )}

      {loading && !info && (
        <div className="grid gap-4 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-48 animate-pulse rounded-2xl bg-[#111a2b]" />)}
        </div>
      )}

      {info && (
        <>
          {/* Health + resources */}
          <div className="grid gap-4 lg:grid-cols-3">
            <section className="surface flex flex-col items-center justify-center p-5">
              <h2 className="mb-3 self-start text-sm font-semibold text-slate-200">Health</h2>
              <ScoreRing score={health?.overallScore || 0} label={health?.status || '—'} size={140} />
              <p className="mt-3 text-center text-xs text-slate-500">
                Computed from memory, CPU, storage, uptime and heap thresholds.
              </p>
            </section>

            <section className="surface space-y-4 p-5 lg:col-span-2">
              <h2 className="text-sm font-semibold text-slate-200">Resources</h2>
              <ProgressBar
                label="Memory"
                value={info.memory?.usedPercent}
                valueText={`${formatBytes(info.memory?.usedBytes)} / ${formatBytes(info.memory?.totalBytes)}`}
              />
              <ProgressBar
                label="CPU load"
                value={info.cpu?.loadPercent}
                valueText={info.cpu?.loadPercent >= 0 ? `${info.cpu.loadPercent}%` : 'not exposed'}
              />
              <ProgressBar
                label="Backend heap"
                value={info.jvm?.heapUsedPercent}
                valueText={`${formatBytes(info.jvm?.heapUsedBytes)} / ${formatBytes(info.jvm?.heapMaxBytes)}`}
              />

              <div className="grid grid-cols-2 gap-3 border-t border-[#1b2740] pt-4 sm:grid-cols-4">
                <div>
                  <p className="label">Processes</p>
                  <p className="mt-0.5 text-lg font-semibold text-white">{info.processCount >= 0 ? info.processCount : '—'}</p>
                </div>
                <div>
                  <p className="label">Processors</p>
                  <p className="mt-0.5 text-lg font-semibold text-white">{info.cpu?.logicalProcessors ?? '—'}</p>
                </div>
                <div>
                  <p className="label">Volumes</p>
                  <p className="mt-0.5 text-lg font-semibold text-white">{info.disks?.length ?? 0}</p>
                </div>
                <div>
                  <p className="label">Adapters</p>
                  <p className="mt-0.5 text-lg font-semibold text-white">{visibleAdapters.length}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Checks */}
          {health?.checks?.length > 0 && (
            <section className="surface p-5">
              <h2 className="text-sm font-semibold text-slate-200">Health checks</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {health.checks.map((check) => {
                  const style = CHECK_STYLE[check.status] || CHECK_STYLE.UNKNOWN;
                  const Icon = style.icon;
                  return (
                    <div key={check.key} className={`rounded-xl border ${style.border} bg-[#0d1524] p-3.5`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                          <Icon className={`h-3.5 w-3.5 ${style.className}`} />
                          {check.label}
                        </span>
                        <span className="mono text-[11px] text-slate-400">{check.value}</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{check.detail}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Host details */}
          <section className="surface p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Server className="h-4 w-4 text-slate-400" /> Host details
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
              <Detail label="Hostname" value={info.hostname} />
              <Detail label="Operating system" value={info.osName} />
              <Detail label="Version" value={info.osVersion} mono />
              <Detail label="Architecture" value={info.osArch} mono />
              <Detail label="CPU model" value={info.cpu?.model} />
              <Detail label="Logical processors" value={info.cpu?.logicalProcessors} />
              <Detail label="Java" value={info.javaVersion} mono />
              <Detail label="Backend started" value={formatDateTime(info.bootTime)} />
              <Detail label="Backend uptime" value={formatUptime(info.uptimeSeconds)} />
              <Detail label="Process count" value={info.processCount >= 0 ? info.processCount : 'not exposed'} />
            </dl>
          </section>

          {/* Volumes */}
          <section className="surface p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <HardDrive className="h-4 w-4 text-slate-400" /> Volumes
            </h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#1f2b45] text-xs text-slate-500">
                    <th className="py-2 pr-4 font-medium">Volume</th>
                    <th className="py-2 pr-4 font-medium">Used</th>
                    <th className="py-2 pr-4 font-medium">Free</th>
                    <th className="py-2 pr-4 font-medium">Total</th>
                    <th className="py-2 font-medium">Usage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b2740]">
                  {info.disks?.map((disk) => (
                    <tr key={disk.name}>
                      <td className="py-2.5 pr-4 font-medium text-slate-200">{disk.name}</td>
                      <td className="mono py-2.5 pr-4 text-slate-400">{disk.usedPercent}%</td>
                      <td className="mono py-2.5 pr-4 text-slate-400">{formatBytes(disk.usableBytes)}</td>
                      <td className="mono py-2.5 pr-4 text-slate-400">{formatBytes(disk.totalBytes)}</td>
                      <td className="py-2.5">
                        <div className="w-32"><ProgressBar value={disk.usedPercent} size="sm" /></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Network */}
          <section className="surface p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Network className="h-4 w-4 text-slate-400" /> Network adapters
              <label className="ml-auto flex cursor-pointer items-center gap-2 text-[11px] font-normal text-slate-400">
                <input
                  type="checkbox"
                  checked={showAllAdapters}
                  onChange={(event) => setShowAllAdapters(event.target.checked)}
                  className="h-3.5 w-3.5 accent-sky-500"
                />
                Show all ({info.network?.length ?? 0})
              </label>
            </h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#1f2b45] text-xs text-slate-500">
                    <th className="py-2 pr-4 font-medium">Adapter</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">IPv4</th>
                    <th className="py-2 pr-4 font-medium">MAC</th>
                    <th className="py-2 font-medium">MTU</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b2740]">
                  {visibleAdapters.map((adapter) => (
                    <tr key={adapter.name}>
                      <td className="py-2.5 pr-4">
                        <p className="font-medium text-slate-200">{adapter.displayName}</p>
                        <p className="mono text-[11px] text-slate-500">{adapter.name}</p>
                      </td>
                      <td className="py-2.5 pr-4">
                        <span className={`inline-flex items-center gap-1 text-xs ${adapter.up ? 'text-emerald-400' : 'text-slate-500'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${adapter.up ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                          {adapter.up ? 'up' : 'down'}
                        </span>
                      </td>
                      <td className="mono py-2.5 pr-4 text-slate-400">{adapter.ipv4?.join(', ') || '—'}</td>
                      <td className="mono py-2.5 pr-4 text-[11px] text-slate-500">{adapter.macAddress || '—'}</td>
                      <td className="mono py-2.5 text-slate-400">{adapter.mtu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Clock className="h-3.5 w-3.5" />
            Metrics are sampled on request{autoRefresh ? ' and every 10 seconds while this page is open' : ''}. Nothing is written to the host.
          </p>
        </>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
