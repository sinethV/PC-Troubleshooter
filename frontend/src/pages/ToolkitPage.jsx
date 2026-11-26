import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Terminal,
  X,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import CommandCard from '../components/commands/CommandCard';
import CommandDetailsModal from '../components/commands/CommandDetailsModal';
import Toast from '../components/common/Toast';
import { commandApi } from '../api/commandApi';
import { categoryApi } from '../api/categoryApi';

const RISK_LEVELS = ['ALL', 'SAFE', 'MODERATE', 'HIGH', 'DANGEROUS'];
const PAGE_SIZE = 12;

export default function ToolkitPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get('category') || '';

  const [categories, setCategories] = useState([]);
  const [commands, setCommands] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [risk, setRisk] = useState('ALL');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [toast, setToast] = useState(null);

  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === categorySlug) || null,
    [categories, categorySlug]
  );

  useEffect(() => {
    categoryApi.getAll()
      .then((res) => setCategories(res?.data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput.trim());
      setPage(0);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    commandApi.search({
      categoryId: activeCategory?.id,
      riskLevel: risk !== 'ALL' ? risk : undefined,
      query: debouncedQuery || undefined,
      page,
      size: PAGE_SIZE,
      sortBy: 'name',
      sortDirection: 'ASC',
    })
      .then((res) => {
        if (!active) return;
        const data = res?.data || {};
        setCommands(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      })
      .catch((err) => {
        if (!active) return;
        setCommands([]);
        setTotalPages(1);
        setTotalElements(0);
        setError(err?.message || 'Could not load the command library.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [activeCategory?.id, risk, debouncedQuery, page, reloadToken]);

  const selectCategory = (slug) => {
    setPage(0);
    if (slug) setSearchParams({ category: slug });
    else setSearchParams({});
  };

  const handleCopy = (command) => {
    setToast({ type: 'success', message: `Copied: ${command.name}` });
    setTimeout(() => setToast(null), 2500);
  };

  const hasFilters = Boolean(categorySlug || debouncedQuery || risk !== 'ALL');

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        icon={Terminal}
        title="Toolkit"
        description="One library for every category: Windows, networking, hardware, security, servers, Linux and printers."
        meta={
          <span className="text-xs text-slate-500">
            {loading ? 'Loading…' : `${totalElements} command${totalElements === 1 ? '' : 's'}`}
            {activeCategory ? ` in ${activeCategory.name}` : ''}
          </span>
        }
        actions={
          <button onClick={() => setReloadToken((t) => t + 1)} className="btn-ghost px-3.5 py-2 text-xs" title="Reload">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Reload
          </button>
        }
      />

      {/* Filters */}
      <div className="surface space-y-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name, syntax, purpose or explanation…"
              className="input pl-10 pr-10"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative sm:w-48">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <select
              value={risk}
              onChange={(event) => { setRisk(event.target.value); setPage(0); }}
              className="input appearance-none pl-9"
              aria-label="Filter by risk level"
            >
              {RISK_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level === 'ALL' ? 'All risk levels' : level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => selectCategory('')}
            className={`chip transition hover:border-sky-500/40 ${!categorySlug ? 'chip-active' : ''}`}
          >
            All categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => selectCategory(category.slug)}
              className={`chip transition hover:border-sky-500/40 ${categorySlug === category.slug ? 'chip-active' : ''}`}
            >
              {category.name}
              <span className="text-slate-500">{category.commandCount}</span>
            </button>
          ))}
        </div>

        {hasFilters && (
          <button
            onClick={() => { setSearchInput(''); setRisk('ALL'); setSearchParams({}); }}
            className="text-xs font-medium text-slate-400 hover:text-sky-300"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results */}
      {error ? (
        <EmptyState
          tone="error"
          title="Library unavailable"
          description={`${error} The toolkit reads commands from PostgreSQL through the backend, so both must be running.`}
          action={
            <button onClick={() => setReloadToken((t) => t + 1)} className="btn-ghost px-3.5 py-2 text-xs">
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          }
        />
      ) : loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-44 animate-pulse rounded-2xl bg-[#111a2b]" />
          ))}
        </div>
      ) : commands.length === 0 ? (
        <EmptyState
          title="No commands match these filters"
          description="Try a broader search term or clear the category and risk filters."
          action={
            <button
              onClick={() => { setSearchInput(''); setRisk('ALL'); setSearchParams({}); }}
              className="btn-ghost px-3.5 py-2 text-xs"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {commands.map((command) => (
              <CommandCard
                key={command.id}
                command={command}
                onViewDetails={setSelectedCommand}
                onCopy={handleCopy}
              />
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-[#1f2b45] pt-4">
            <span className="text-xs text-slate-500">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0 || loading}
                className="btn-ghost px-3 py-2 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1 || loading}
                className="btn-ghost px-3 py-2 text-xs"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </>
      )}

      {selectedCommand && (
        <CommandDetailsModal
          command={selectedCommand}
          onClose={() => setSelectedCommand(null)}
          onCopy={handleCopy}
        />
      )}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
