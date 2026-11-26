import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CircleCheck,
  CircleHelp,
  HardDrive,
  LayoutDashboard,
  RefreshCw,
  Server,
  Sparkles,
  Terminal,
  Ticket,
  Users,
  XCircle,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import ScoreRing from '../components/ui/ScoreRing';
import ProgressBar from '../components/ui/ProgressBar';
import EmptyState from '../components/ui/EmptyState';
import RiskBadge from '../components/common/RiskBadge';
import CommandDetailsModal from '../components/commands/CommandDetailsModal';
import { systemApi } from '../api/systemApi';
import { dashboardApi } from '../api/dashboardApi';
import { formatBytes, formatDateTime, formatUptime } from '../utils/format';

const CHECK_ICONS = {
  OK: { icon: CircleCheck, className: 'text-emerald-400' },
  WARN: { icon: AlertTriangle, className: 'text-amber-400' },
  CRITICAL: { icon: XCircle, className: 'text-rose-400' },
  UNKNOWN: { icon: CircleHelp, className: 'text-slate-500' },
};

function StatTile({ icon: Icon, label, value, hint }) {
  return (
    <div className="surface p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [info, setInfo] = useState(null);
  const [health, setHealth] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState(null);
  const [selectedCommand, setSelectedCommand] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [infoResult, healthResult, summaryResult] = await Promise.allSettled([
      systemApi.getInfo(),
      systemApi.getHealth(),
      dashboardApi.getSummary(),
    ]);

    const nextInfo = infoResult.status === 'fulfilled' ? infoResult.value?.data : null;
    const nextHealth = healthResult.status === 'fulfilled' ? healthResult.value?.data : null;
    const nextSummary = summaryResult.status === 'fulfilled' ? summaryResult.value?.data : null;

    setInfo(nextInfo);
    setHealth(nextHealth);
    setSummary(nextSummary);
    setOffline(!nextInfo && !nextHealth && !nextSummary);
    setRefreshedAt(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const worstDisk = info?.disks?.length
    ? info.disks.reduce((worst, disk) => (disk.usedPercent > (worst?.usedPercent ?? -1) ? disk : worst), null)
    : null;

  return (
    <div className="space-y-7 animate-fade-in">
      <PageHeader
        icon={LayoutDashboard}
        title="Overview"
        description="Live state of this machine and the technician library. Every value below comes from the backend or the database."
        meta={
          <span className="text-xs text-slate-500">
            {refreshedAt ? `Updated ${formatDateTime(refreshedAt)}` : 'Loading…'}
          </span>
        }
        actions={
          <button onClick={load} disabled={loading} className="btn-ghost px-3.5 py-2 text-xs">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        }
      />

      {offline && (
        <EmptyState
          tone="error"
          title="Backend is not reachable"
          description="The dashboard needs the Spring Boot API on port 8080. Start PostgreSQL, then run the backend. Nothing on this page is simulated, so it stays empty until the API answers."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <button onClick={load} className="btn-primary px-3.5 py-2 text-xs">
                <RefreshCw className="h-3.5 w-3.5" /> Try again
              </button>
              <Link to="/settings" className="btn-ghost px-3.5 py-2 text-xs">
                Connection settings
              </Link>
            </div>
          }
        />
      )}

      {!offline && (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Health */}
            <section className="surface p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">Health score</h2>
                <span className="text-xs text-slate-500">measured</span>
              </div>

              {health ? (
                <>
                  <div className="mt-4 flex justify-center">
                    <ScoreRing score={health.overallScore} label={health.status} />
                  </div>
                  <ul className="mt-5 space-y-2.5">
                    {(health.checks || []).slice(0, 4).map((check) => {
                      const style = CHECK_ICONS[check.status] || CHECK_ICONS.UNKNOWN;
                      const Icon = style.icon;
                      return (
                        <li key={check.key} className="flex items-start gap-2.5">
                          <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.className}`} />
                          <div className="min-w-0">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="truncate text-xs font-medium text-slate-300">{check.label}</span>
                              <span className="mono shrink-0 text-[11px] text-slate-400">{check.value}</span>
                            </div>
                            <p className="truncate text-[11px] text-slate-500">{check.detail}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Health data unavailable.</p>
              )}
            </section>

            {/* Host + resources */}
            <section className="surface p-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">This machine</h2>
                <span className="chip">
                  <Server className="h-3 w-3" />
                  {info?.hostname || 'unknown host'}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="label">Operating system</dt>
                  <dd className="mt-0.5 truncate text-slate-200" title={info?.osName}>{info?.osName || '—'}</dd>
                </div>
                <div>
                  <dt className="label">Version</dt>
                  <dd className="mono mt-0.5 truncate text-slate-300" title={info?.osVersion}>{info?.osVersion || '—'}</dd>
                </div>
                <div>
                  <dt className="label">Architecture</dt>
                  <dd className="mono mt-0.5 text-slate-300">{info?.osArch || '—'}</dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="label">CPU</dt>
                  <dd className="mt-0.5 truncate text-slate-200" title={info?.cpu?.model}>{info?.cpu?.model || '—'}</dd>
                </div>
                <div>
                  <dt className="label">Processors</dt>
                  <dd className="mt-0.5 text-slate-200">{info?.cpu?.logicalProcessors ?? '—'} logical</dd>
                </div>
                <div>
                  <dt className="label">Backend uptime</dt>
                  <dd className="mt-0.5 text-slate-200">{formatUptime(info?.uptimeSeconds)}</dd>
                </div>
              </dl>

              <div className="mt-5 space-y-4 border-t border-[#1b2740] pt-4">
                <ProgressBar
                  label="Memory"
                  value={info?.memory?.usedPercent}
                  valueText={`${formatBytes(info?.memory?.usedBytes)} / ${formatBytes(info?.memory?.totalBytes)}`}
                />
                <ProgressBar
                  label="CPU load"
                  value={info?.cpu?.loadPercent}
                  valueText={info?.cpu?.loadPercent >= 0 ? `${info.cpu.loadPercent}%` : 'not exposed'}
                />
                {worstDisk && (
                  <ProgressBar
                    label={`Disk ${worstDisk.name}`}
                    value={worstDisk.usedPercent}
                    valueText={`${formatBytes(worstDisk.usableBytes)} free of ${formatBytes(worstDisk.totalBytes)}`}
                  />
                )}
              </div>
            </section>
          </div>

          {/* Counters */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatTile icon={Terminal} label="Commands" value={summary?.totalCommands ?? '—'} hint="in the library" />
            <StatTile icon={BookOpen} label="Guides" value={summary?.totalGuides ?? '—'} hint="step-by-step workflows" />
            <StatTile icon={Ticket} label="Open tickets" value={summary?.openTickets ?? '—'} hint={`${summary?.totalTickets ?? 0} total`} />
            <StatTile icon={Users} label="Customers" value={summary?.totalCustomers ?? '—'} hint="in the database" />
          </div>

          {/* Quick actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Link to="/ask" className="surface group p-5 transition hover:border-sky-500/40">
              <Sparkles className="h-5 w-5 text-sky-400" />
              <h3 className="mt-3 text-sm font-semibold text-slate-100">Ask AI</h3>
              <p className="mt-1 text-sm text-slate-400">
                Describe a symptom and get matching commands and guides with the reason they matched.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-400">
                Solve a problem <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <Link to="/toolkit" className="surface group p-5 transition hover:border-sky-500/40">
              <Terminal className="h-5 w-5 text-emerald-400" />
              <h3 className="mt-3 text-sm font-semibold text-slate-100">Toolkit</h3>
              <p className="mt-1 text-sm text-slate-400">
                Browse all categories, filter by risk, and copy verified commands.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-400">
                Open toolkit <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <Link to="/diagnostics" className="surface group p-5 transition hover:border-sky-500/40">
              <Activity className="h-5 w-5 text-amber-400" />
              <h3 className="mt-3 text-sm font-semibold text-slate-100">Diagnostics</h3>
              <p className="mt-1 text-sm text-slate-400">
                Live CPU, memory, storage, network adapters and JVM metrics from this host.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-400">
                Inspect host <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

          {/* Categories + recent */}
          <div className="grid gap-4 lg:grid-cols-5">
            <section className="surface p-5 lg:col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">Command categories</h2>
                <Link to="/toolkit" className="link text-xs">View all</Link>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {(summary?.categories || []).map((category) => (
                  <Link
                    key={category.id}
                    to={`/toolkit?category=${category.slug}`}
                    className="group rounded-xl border border-[#1f2b45] bg-[#0d1524] p-3 transition hover:border-sky-500/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-slate-200 group-hover:text-white">
                        {category.name}
                      </span>
                      <span className="shrink-0 rounded-full bg-[#16223a] px-2 py-0.5 text-[11px] text-slate-400">
                        {category.commandCount}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">{category.description}</p>
                  </Link>
                ))}
                {!summary?.categories?.length && (
                  <p className="text-sm text-slate-500">No categories returned by the API.</p>
                )}
              </div>
            </section>

            <section className="surface p-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">Recently added</h2>
                <Link to="/toolkit" className="link text-xs">Library</Link>
              </div>
              <ul className="mt-3 divide-y divide-[#1b2740]">
                {(summary?.recentCommands || []).map((command) => (
                  <li key={command.id}>
                    <button
                      onClick={() => setSelectedCommand(command)}
                      className="flex w-full items-center justify-between gap-3 py-2.5 text-left transition hover:text-white"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-slate-300">{command.name}</p>
                        <p className="mono truncate text-[11px] text-slate-500">{command.commandSyntax}</p>
                      </div>
                      <RiskBadge level={command.riskLevel} />
                    </button>
                  </li>
                ))}
                {!summary?.recentCommands?.length && (
                  <li className="py-2 text-sm text-slate-500">No commands returned.</li>
                )}
              </ul>
            </section>
          </div>

          {/* Storage summary */}
          {info?.disks?.length > 0 && (
            <section className="surface p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <HardDrive className="h-4 w-4 text-slate-400" />
                Volumes
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {info.disks.map((disk) => (
                  <div key={disk.name} className="surface-2 p-3.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-200">{disk.name}</span>
                      <span className="mono text-xs text-slate-400">{disk.usedPercent}%</span>
                    </div>
                    <div className="mt-2">
                      <ProgressBar value={disk.usedPercent} size="sm" />
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      {formatBytes(disk.usableBytes)} free of {formatBytes(disk.totalBytes)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {selectedCommand && (
        <CommandDetailsModal
          command={selectedCommand}
          onClose={() => setSelectedCommand(null)}
        />
      )}
    </div>
  );
}
