import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gauge,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import GuideModal from '../components/guides/GuideModal';
import { guideApi } from '../api/guideApi';

const DIFFICULTIES = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
const PAGE_SIZE = 12;

const DIFFICULTY_STYLE = {
  BEGINNER: 'text-emerald-300 border-emerald-500/25 bg-emerald-500/10',
  INTERMEDIATE: 'text-amber-300 border-amber-500/25 bg-amber-500/10',
  ADVANCED: 'text-rose-300 border-rose-500/25 bg-rose-500/10',
};

export default function GuidesPage() {
  const [guides, setGuides] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [difficulty, setDifficulty] = useState('ALL');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

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

    guideApi.search({
      query: debouncedQuery || undefined,
      difficulty: difficulty !== 'ALL' ? difficulty : undefined,
      page,
      size: PAGE_SIZE,
    })
      .then((res) => {
        if (!active) return;
        const data = res?.data || {};
        setGuides(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      })
      .catch((err) => {
        if (!active) return;
        setGuides([]);
        setTotalPages(1);
        setTotalElements(0);
        setError(err?.message || 'Could not load troubleshooting guides.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery, difficulty, page, reloadToken]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        icon={BookOpen}
        title="Guides"
        description="Step-by-step diagnostic workflows stored in your database, with commands, warnings and expected results."
        meta={
          <span className="text-xs text-slate-500">
            {loading ? 'Loading…' : `${totalElements} guide${totalElements === 1 ? '' : 's'}`}
          </span>
        }
        actions={
          <button onClick={() => setReloadToken((t) => t + 1)} className="btn-ghost px-3.5 py-2 text-xs">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Reload
          </button>
        }
      />

      <div className="surface space-y-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search guides by title, symptom or description…"
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

          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((level) => (
              <button
                key={level}
                onClick={() => { setDifficulty(level); setPage(0); }}
                className={`chip transition hover:border-sky-500/40 ${difficulty === level ? 'chip-active' : ''}`}
              >
                {level === 'ALL' ? 'All levels' : level.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <EmptyState
          tone="error"
          title="Guides unavailable"
          description={`${error} Guides are read from the backend and database.`}
          action={
            <button onClick={() => setReloadToken((t) => t + 1)} className="btn-ghost px-3.5 py-2 text-xs">
              Retry
            </button>
          }
        />
      ) : loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-2xl bg-[#111a2b]" />
          ))}
        </div>
      ) : guides.length === 0 ? (
        <EmptyState
          title="No guides match"
          description="Try a different symptom or clear the difficulty filter."
          action={
            <button
              onClick={() => { setSearchInput(''); setDifficulty('ALL'); setPage(0); }}
              className="btn-ghost px-3.5 py-2 text-xs"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {guides.map((guide) => (
              <button
                key={guide.id}
                onClick={() => setSelectedGuide(guide.id)}
                className="surface p-5 text-left transition hover:border-sky-500/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-100">{guide.title}</h3>
                  <span className={`chip shrink-0 ${DIFFICULTY_STYLE[guide.difficulty] || ''}`}>
                    {guide.difficulty?.toLowerCase()}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-slate-400">{guide.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="chip"><Clock className="h-3 w-3" />{guide.estimatedTimeMinutes} min</span>
                  <span className="chip"><Gauge className="h-3 w-3" />{guide.categoryName}</span>
                  {guide.symptoms && <span className="line-clamp-1 max-w-full">{guide.symptoms}</span>}
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-[#1f2b45] pt-4">
            <span className="text-xs text-slate-500">Page {page + 1} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn-ghost px-3 py-2 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="btn-ghost px-3 py-2 text-xs"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </>
      )}

      {selectedGuide && <GuideModal guideId={selectedGuide} onClose={() => setSelectedGuide(null)} />}
    </div>
  );
}
