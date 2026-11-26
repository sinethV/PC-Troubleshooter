import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (query) {
      navigate(`/ask?q=${encodeURIComponent(query)}`);
      setSearchTerm('');
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-[#1f2b45] bg-[#0a101d]/90 px-4 backdrop-blur sm:px-6">
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Describe a problem or search commands…"
          className="input pl-10 pr-3"
          aria-label="Search commands or ask a question"
        />
      </form>

      <div className="ml-auto hidden items-center gap-2 text-xs text-slate-500 sm:flex">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        <span>Copy-only execution</span>
      </div>
    </header>
  );
}
