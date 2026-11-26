import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Key,
  ExternalLink,
  ChevronRight,
  FileText,
  X,
  Sparkles,
  Layers,
  ArrowRight,
  Copy,
  Terminal,
  ShieldAlert,
  Flame,
  BatteryCharging,
  Lock,
  Keyboard,
  Tv,
  HelpCircle,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { computerModels, brandDossiers, commonSymptomsList } from '../data/computerModelsData';
import ModelDetailsModal from '../components/pc/ModelDetailsModal';
import { copyToClipboard } from '../utils/copyToClipboard';

export default function PCInfoPage() {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const [activeView, setActiveView] = useState('model_search'); // 'model_search', 'problem_kb', 'local_audit'
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSymptom, setSelectedSymptom] = useState('ALL');
  const [activeModelModal, setActiveModelModal] = useState(null);
  const [copiedCmd, setCopiedCmd] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (urlQuery) {
      setSearchQuery(urlQuery);
      setActiveView('model_search');
      // If url query matches a known brand, set brand filter too
      const upper = urlQuery.toUpperCase();
      if (['ASUS', 'DELL', 'LENOVO', 'HP', 'APPLE', 'MICROSOFT', 'RAZER', 'MSI', 'ACER', 'SAMSUNG'].includes(upper)) {
        setSelectedBrand(upper);
      }
    }
  }, [urlQuery]);

  const brands = ['ALL', 'ASUS', 'DELL', 'LENOVO', 'HP', 'APPLE', 'MICROSOFT', 'RAZER', 'MSI', 'ACER', 'SAMSUNG'];
  const categories = ['ALL', 'Gaming Laptop', 'Ultrabook', 'Business Laptop', 'Workstation / Creator', '2-in-1 Touch', 'Budget Laptop', 'Business Desktop'];

  // Handle Copy to clipboard
  const handleCopy = async (cmd, id) => {
    const ok = await copyToClipboard(cmd);
    if (ok) {
      setCopiedCmd(id);
      setTimeout(() => setCopiedCmd(null), 2000);
    }
  };

  // Search suggestions autocomplete computation
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase().trim();
    const results = [];

    // Match brands
    brands.filter(b => b !== 'ALL').forEach(b => {
      if (b.toLowerCase().includes(q)) {
        results.push({ type: 'brand', label: `${b} Computers & Laptops`, value: b });
      }
    });

    // Match computer models
    computerModels.forEach(m => {
      if (m.model.toLowerCase().includes(q) || m.series.toLowerCase().includes(q)) {
        results.push({ type: 'model', label: `${m.brand} - ${m.model}`, model: m, value: m.model });
      }
    });

    // Match specific problem titles
    computerModels.forEach(m => {
      m.commonIssues.forEach(issue => {
        if (issue.title.toLowerCase().includes(q) || issue.symptoms.toLowerCase().includes(q)) {
          results.push({
            type: 'problem',
            label: `${issue.title} (${m.brand})`,
            model: m,
            issue,
            value: issue.title
          });
        }
      });
    });

    return results.slice(0, 8);
  }, [searchQuery, brands]);

  // Filtered models computation
  const filteredModels = useMemo(() => {
    return computerModels.filter(item => {
      // Brand filter
      if (selectedBrand !== 'ALL' && item.brand.toUpperCase() !== selectedBrand.toUpperCase()) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      // Symptom filter
      if (selectedSymptom !== 'ALL') {
        const matchesSymptom = item.commonIssues.some(issue => {
          const text = (issue.title + ' ' + issue.symptoms + ' ' + issue.cause).toLowerCase();
          switch (selectedSymptom) {
            case 'wifi':
              return text.includes('wifi') || text.includes('wi-fi') || text.includes('ethernet') || text.includes('network') || text.includes('lan');
            case 'thermal':
              return text.includes('overheat') || text.includes('fan') || text.includes('thermal') || text.includes('throttle') || text.includes('heat');
            case 'screen':
              return text.includes('screen') || text.includes('display') || text.includes('mux') || text.includes('flicker') || text.includes('black screen') || text.includes('oled');
            case 'battery':
              return text.includes('battery') || text.includes('sleep') || text.includes('charging') || text.includes('drain') || text.includes('standby');
            case 'bsod':
              return text.includes('bsod') || text.includes('blue screen') || text.includes('crash') || text.includes('panic') || text.includes('loop');
            case 'bitlocker':
              return text.includes('bitlocker') || text.includes('tpm') || text.includes('recovery key') || text.includes('bios change');
            case 'input':
              return text.includes('touchpad') || text.includes('trackpad') || text.includes('keyboard') || text.includes('trackpoint') || text.includes('numberpad');
            case 'dock':
              return text.includes('dock') || text.includes('thunderbolt') || text.includes('usb-c') || text.includes('monitor') || text.includes('external');
            default:
              return true;
          }
        });
        if (!matchesSymptom) return false;
      }

      // Universal search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesBasic =
          item.brand.toLowerCase().includes(q) ||
          item.model.toLowerCase().includes(q) ||
          item.series.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.specs.cpu.toLowerCase().includes(q) ||
          item.specs.gpu.toLowerCase().includes(q) ||
          item.recoveryKeys.biosKey.toLowerCase().includes(q);

        const matchesProblems = item.commonIssues.some(issue =>
          issue.title.toLowerCase().includes(q) ||
          issue.symptoms.toLowerCase().includes(q) ||
          issue.cause.toLowerCase().includes(q) ||
          issue.solution.toLowerCase().includes(q)
        );

        return matchesBasic || matchesProblems;
      }

      return true;
    });
  }, [searchQuery, selectedBrand, selectedCategory, selectedSymptom]);

  // Filtered individual problems list (for Problem Knowledgebase view)
  const filteredProblemsList = useMemo(() => {
    const list = [];
    filteredModels.forEach(model => {
      model.commonIssues.forEach(issue => {
        if (!searchQuery.trim()) {
          list.push({ model, issue });
        } else {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            model.brand.toLowerCase().includes(q) ||
            model.model.toLowerCase().includes(q) ||
            issue.title.toLowerCase().includes(q) ||
            issue.symptoms.toLowerCase().includes(q) ||
            issue.cause.toLowerCase().includes(q) ||
            issue.solution.toLowerCase().includes(q);
          if (matches) {
            list.push({ model, issue });
          }
        }
      });
    });
    return list;
  }, [filteredModels, searchQuery]);

  // Total count of verified solutions in view
  const totalSolutionsCount = useMemo(() => {
    return filteredModels.reduce((acc, m) => acc + m.commonIssues.length, 0);
  }, [filteredModels]);

  // Current active brand dossier (if user selected or searched a specific brand)
  const currentBrandDossier = useMemo(() => {
    if (selectedBrand !== 'ALL' && brandDossiers[selectedBrand]) {
      return brandDossiers[selectedBrand];
    }
    const q = searchQuery.trim().toUpperCase();
    if (brandDossiers[q]) {
      return brandDossiers[q];
    }
    return null;
  }, [selectedBrand, searchQuery]);

  // Local PC Spec Data
  const localSpecs = [
    {
      category: 'Operating System',
      icon: Monitor,
      items: [
        { label: 'OS Name', value: 'Microsoft Windows 11 Pro' },
        { label: 'Version / Build', value: '23H2 (OS Build 22631.4460)' },
        { label: 'System Type', value: '64-bit operating system, x64-based processor' },
        { label: 'Windows Experience', value: 'Feature Experience Pack 1000.22700.1047.0' }
      ]
    },
    {
      category: 'Processor & Motherboard',
      icon: Cpu,
      items: [
        { label: 'Processor', value: '13th Gen Intel(R) Core(TM) i7-13700H @ 2.40 GHz' },
        { label: 'Cores / Threads', value: '14 Cores (6 P-cores, 8 E-cores) / 20 Logical Processors' },
        { label: 'Motherboard', value: 'Dell Inc. 0V8F6M (A00)' },
        { label: 'BIOS Version', value: 'Dell Inc. 1.14.0 (UEFI, Secure Boot ON)' }
      ]
    },
    {
      category: 'Memory & Storage',
      icon: HardDrive,
      items: [
        { label: 'Installed Physical RAM', value: '16.0 GB (15.7 GB usable) DDR5 @ 4800 MHz' },
        { label: 'Memory Slots', value: '2 of 2 slots utilized' },
        { label: 'Primary Drive', value: 'Samsung PM9A1 NVMe 512GB (SMART Health: 99% Good)' },
        { label: 'Drive File System', value: 'NTFS (BitLocker Encrypted)' }
      ]
    },
    {
      category: 'Network & Security',
      icon: Wifi,
      items: [
        { label: 'Wi-Fi Adapter', value: 'Intel(R) Wi-Fi 6E AX211 160MHz' },
        { label: 'MAC Address', value: '00:1A:2B:3C:4D:5E' },
        { label: 'IPv4 Address', value: '192.168.1.112 / 24' },
        { label: 'TPM 2.0 State', value: 'Enabled and Ready for Attestation' }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 max-w-7xl mx-auto pb-12">
      
      {/* Top Header & View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#14234b]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-400 text-slate-950">
              Universal PC Search Engine
            </span>
            <span className="text-xs text-slate-400">All Major Brands & Models</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Monitor className="w-7 h-7 text-cyan-400" />
            PC Hardware & Known Issue Knowledgebase
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search any computer model (e.g. <span className="text-cyan-300 font-semibold cursor-pointer hover:underline" onClick={() => { setSearchQuery('Asus'); setSelectedBrand('ASUS'); }}>Asus</span>, <span className="text-cyan-300 font-semibold cursor-pointer hover:underline" onClick={() => { setSearchQuery('Dell'); setSelectedBrand('DELL'); }}>Dell</span>, <span className="text-cyan-300 font-semibold cursor-pointer hover:underline" onClick={() => { setSearchQuery('ThinkPad'); setSelectedBrand('LENOVO'); }}>ThinkPad</span>, <span className="text-cyan-300 font-semibold cursor-pointer hover:underline" onClick={() => { setSearchQuery('MacBook'); setSelectedBrand('APPLE'); }}>MacBook</span>) or specific problem for full specs, BIOS keys, and verified solutions.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#090f24] border border-[#162752] rounded-2xl shrink-0 self-start lg:self-center">
          <button
            onClick={() => setActiveView('model_search')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeView === 'model_search'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Browse Models ({filteredModels.length})
          </button>

          <button
            onClick={() => setActiveView('problem_kb')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeView === 'problem_kb'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Problem Database ({filteredProblemsList.length})
          </button>

          <button
            onClick={() => setActiveView('local_audit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeView === 'local_audit'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Local PC Audit
          </button>
        </div>
      </div>

      {/* VIEW 1 & 2: UNIVERSAL SEARCH & HARDWARE DATABASE */}
      {(activeView === 'model_search' || activeView === 'problem_kb') && (
        <div className="space-y-6">
          
          {/* Main Search Bar & Live Autocomplete Box */}
          <div className="p-6 rounded-3xl cyber-card border border-[#162752] space-y-4 shadow-xl relative">
            <div className="relative">
              <Search className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search computer model or problem (e.g. 'Asus', 'ROG G14', 'Dell XPS', 'battery stuck 60%', 'wifi disconnect', 'bsod', 'bios key')..."
                className="w-full pl-12 pr-28 py-4 text-sm bg-[#080d1f] border border-[#1c3266] rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 text-white placeholder-slate-500 transition shadow-inner font-medium"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <span className="hidden sm:inline-block px-2 py-1 rounded bg-[#101b38] border border-[#1a2d5c] text-[11px] font-mono text-cyan-400">
                  ESC to close
                </span>
              </div>

              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-[#090f24] border border-[#1b2f60] rounded-2xl shadow-2xl z-40 overflow-hidden divide-y divide-[#132247]">
                  <div className="px-4 py-2 bg-[#060a17] text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Quick Search Suggestions</span>
                    <span>{suggestions.length} matches</span>
                  </div>
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (item.type === 'brand') {
                          setSelectedBrand(item.value);
                          setSearchQuery(item.value);
                        } else if (item.type === 'model') {
                          setActiveModelModal(item.model);
                        } else if (item.type === 'problem') {
                          setActiveModelModal(item.model);
                        }
                        setShowSuggestions(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-[#121f44] transition flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        {item.type === 'brand' && (
                          <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                            B
                          </span>
                        )}
                        {item.type === 'model' && (
                          <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                            M
                          </span>
                        )}
                        {item.type === 'problem' && (
                          <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                            !
                          </span>
                        )}
                        <div>
                          <p className="font-semibold text-white">{item.label}</p>
                          <span className="text-[10px] text-slate-400 capitalize">{item.type} match</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Brand Filter Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter by Computer Brand:
                </span>
                {selectedBrand !== 'ALL' && (
                  <button
                    onClick={() => {
                      setSelectedBrand('ALL');
                      setSearchQuery('');
                    }}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    Reset Brand Filter <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {brands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => {
                      setSelectedBrand(brand);
                      if (brand !== 'ALL') {
                        setSearchQuery(brand);
                      } else {
                        setSearchQuery('');
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedBrand === brand
                        ? 'bg-cyan-400 text-slate-950 shadow-neon-cyan font-black'
                        : 'bg-[#090f24] hover:bg-[#121f42] text-slate-300 border border-[#14234b]'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Symptom Chips Filter Bar */}
            <div className="space-y-2 pt-2 border-t border-[#14234b]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Quick Problem & Symptom Filters:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedSymptom('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedSymptom === 'ALL'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[#090f24] text-slate-400 hover:text-white border border-[#14234b]'
                  }`}
                >
                  All Issues
                </button>
                {commonSymptomsList.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSymptom(selectedSymptom === s.id ? 'ALL' : s.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      selectedSymptom === s.id
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-[#090f24] text-slate-300 hover:bg-[#121f42] border border-[#14234b]'
                    }`}
                  >
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* BRAND DOSSIER CARD: Displays when user clicks/searches a specific brand like ASUS */}
          {currentBrandDossier && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1633] via-[#091026] to-[#060a17] border border-[#1c3266] space-y-4 shadow-2xl relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#162752] pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-lg">
                    {currentBrandDossier.name.substring(0, 4)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-400 text-slate-950">
                        Brand Dossier
                      </span>
                      <span className="text-xs text-slate-400">{currentBrandDossier.fullName}</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-white mt-0.5">
                      {currentBrandDossier.name} Hardware Ecosystem & Diagnostics
                    </h2>
                  </div>
                </div>

                <a
                  href={currentBrandDossier.supportUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#121f42] hover:bg-[#1a2d5c] text-cyan-300 text-xs font-bold transition flex items-center gap-2 self-start md:self-auto border border-[#1b2f60]"
                >
                  Official Support Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="text-xs text-slate-300">
                {currentBrandDossier.description}
              </p>

              {/* Brand Recovery Hotkeys Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-[#080e22] border border-[#16254c]">
                  <span className="text-slate-400 block text-[11px] mb-1">Enter UEFI / BIOS Setup</span>
                  <span className="font-mono font-bold text-white text-xs bg-black/40 px-2 py-0.5 rounded border border-slate-700">
                    {currentBrandDossier.biosKey}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#080e22] border border-[#16254c]">
                  <span className="text-slate-400 block text-[11px] mb-1">One-Time Boot Menu</span>
                  <span className="font-mono font-bold text-white text-xs bg-black/40 px-2 py-0.5 rounded border border-slate-700">
                    {currentBrandDossier.bootMenu}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#080e22] border border-[#16254c]">
                  <span className="text-slate-400 block text-[11px] mb-1">Recovery Partition</span>
                  <span className="font-mono font-bold text-white text-xs bg-black/40 px-2 py-0.5 rounded border border-slate-700">
                    {currentBrandDossier.recoveryPartition}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#080e22] border border-[#16254c]">
                  <span className="text-slate-400 block text-[11px] mb-1">Hardware Diagnostic Tool</span>
                  <span className="font-mono font-bold text-cyan-300 text-xs truncate block">
                    {currentBrandDossier.diagnosticTool}
                  </span>
                </div>
              </div>

              {/* Technician Field Tips */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200 space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-cyan-400 text-[10px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Essential Technician Field Tips for {currentBrandDossier.name}:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                  {currentBrandDossier.topTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Results Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs px-2 text-slate-400 gap-2">
            <span>
              Showing <strong className="text-white font-mono">{filteredModels.length}</strong> computer models with <strong className="text-cyan-400 font-mono">{totalSolutionsCount}</strong> verified diagnostic fixes
            </span>
            <div className="flex items-center gap-3">
              {searchQuery && (
                <span className="text-cyan-300 font-medium">
                  Keyword: "{searchQuery}"
                </span>
              )}
              {selectedSymptom !== 'ALL' && (
                <span className="text-amber-300 font-medium">
                  Symptom: {commonSymptomsList.find(s => s.id === selectedSymptom)?.label}
                </span>
              )}
            </div>
          </div>

          {/* TAB CONTENT 1: COMPUTER MODEL CARDS GRID */}
          {activeView === 'model_search' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.length === 0 ? (
                <div className="col-span-full p-12 text-center rounded-3xl cyber-card border border-[#162752] space-y-3">
                  <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">No computer models match your search query</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Try searching for popular brands like "Asus", "Dell", "Lenovo", "HP", "Apple", or problem keywords like "wifi", "battery", "black screen".
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBrand('ALL');
                      setSelectedCategory('ALL');
                      setSelectedSymptom('ALL');
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                filteredModels.map(item => (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-[#090f24] border border-[#162752] hover:border-cyan-500/40 transition-all duration-300 flex flex-col overflow-hidden group shadow-lg hover:shadow-cyan-500/10"
                  >
                    {/* Model Photo & Brand Tag Header */}
                    <div className="relative h-44 w-full bg-[#050914] overflow-hidden border-b border-[#14234b]">
                      <img
                        src={item.image}
                        alt={item.model}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090f24] via-transparent to-black/60" />

                      {/* Floating Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-400 text-slate-950">
                          {item.brand}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-slate-300 border border-white/10">
                          {item.year}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-600/80 backdrop-blur-md text-white border border-blue-400/30">
                          {item.category}
                        </span>
                      </div>

                      {/* Model Title at Bottom of Image */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-[11px] font-semibold text-cyan-300 block">{item.series}</span>
                        <h3 className="text-base font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                          {item.model}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      
                      {/* Specs Highlights */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2 text-slate-300">
                          <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1 font-mono text-[11px]">{item.specs.cpu}</span>
                        </div>
                        <div className="flex items-start gap-2 text-slate-300">
                          <HardDrive className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1 font-mono text-[11px]">{item.specs.ram}</span>
                        </div>
                        <div className="flex items-start gap-2 text-slate-300">
                          <Monitor className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1 font-mono text-[11px]">{item.specs.display}</span>
                        </div>
                      </div>

                      {/* Recovery Hotkeys Quick Strip */}
                      <div className="p-2.5 rounded-xl bg-[#050914] border border-[#132247] flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Key className="w-3 h-3 text-cyan-400" /> BIOS Key:
                        </span>
                        <span className="font-mono font-bold text-white bg-slate-800/80 px-2 py-0.5 rounded text-[10px] border border-slate-700">
                          {item.recoveryKeys.biosKey.split(' ')[0]}
                        </span>
                        <span className="text-slate-400 ml-2">Boot:</span>
                        <span className="font-mono font-bold text-white bg-slate-800/80 px-2 py-0.5 rounded text-[10px] border border-slate-700">
                          {item.recoveryKeys.bootMenu.split(' ')[0]}
                        </span>
                      </div>

                      {/* Known Issues Preview */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                          <span>Known Problems & Fixes</span>
                          <span className="text-amber-400">{item.commonIssues.length} Verified</span>
                        </span>
                        {item.commonIssues.slice(0, 2).map(issue => (
                          <div
                            key={issue.id}
                            className="p-2 rounded-xl bg-[#080e22] border border-[#14234b] text-[11px] flex items-center justify-between gap-2"
                          >
                            <span className="truncate text-slate-200">{issue.title}</span>
                            <span className="text-[10px] font-bold text-cyan-400 shrink-0">Fix &gt;</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button: Opens Full Tech Dossier Modal */}
                      <button
                        onClick={() => setActiveModelModal(item)}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500 hover:to-blue-600 text-cyan-300 hover:text-slate-950 font-bold text-xs border border-cyan-500/30 transition-all duration-200 flex items-center justify-center gap-2 group-hover:border-cyan-400"
                      >
                        <span>View Full Tech Dossier & Solutions</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB CONTENT 2: PROBLEM KNOWLEDGEBASE SEARCH VIEW */}
          {activeView === 'problem_kb' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 flex items-center justify-between">
                <span>Direct Problem Search Engine: Showing verified symptoms, root causes, and copyable PowerShell remediations across all PC models.</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                  {filteredProblemsList.length} Issues Found
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProblemsList.map(({ model, issue }) => (
                  <div
                    key={issue.id}
                    className="p-5 rounded-2xl bg-[#090f24] border border-[#162752] hover:border-cyan-500/40 space-y-3 transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Model & Brand Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-400 text-slate-950">
                            {model.brand}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold cursor-pointer hover:underline" onClick={() => setActiveModelModal(model)}>
                            {model.model}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{issue.id}</span>
                      </div>

                      {/* Problem Title */}
                      <h4 className="text-sm font-bold text-white mb-2">{issue.title}</h4>

                      <div className="space-y-1.5 text-xs">
                        <div className="p-2.5 rounded-xl bg-[#0e1732] border border-[#1a2d5c]">
                          <strong className="text-rose-400">Symptoms: </strong>
                          <span className="text-slate-300">{issue.symptoms}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#0e1732] border border-[#1a2d5c]">
                          <strong className="text-amber-400">Root Cause: </strong>
                          <span className="text-slate-300">{issue.cause}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-200">
                          <strong className="text-emerald-400">Verified Fix: </strong>
                          <span>{issue.solution}</span>
                        </div>
                      </div>
                    </div>

                    {/* Copyable Automation Script */}
                    {issue.command && (
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <Terminal className="w-3 h-3 text-cyan-400" /> Automated Fix Script
                          </span>
                          <button
                            onClick={() => handleCopy(issue.command, issue.id)}
                            className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            {copiedCmd === issue.id ? (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Copied
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Copy className="w-3 h-3" /> Copy Script
                              </span>
                            )}
                          </button>
                        </div>
                        <div className="p-2.5 bg-black/60 rounded-xl font-mono text-xs text-cyan-300 border border-[#182a54] overflow-x-auto">
                          <code>{issue.command}</code>
                        </div>
                      </div>
                    )}

                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => setActiveModelModal(model)}
                        className="text-cyan-400 hover:underline font-semibold"
                      >
                        View Full {model.model} Specs &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* VIEW 3: LOCAL MACHINE AUDIT VIEW */}
      {activeView === 'local_audit' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 flex items-center justify-between">
            <span>Hardware audit telemetry detected from the active host machine.</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ● Live Client Session
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localSpecs.map((section, idx) => {
              const Icon = section.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl cyber-card border border-[#162752] space-y-4 shadow-xl"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-[#14234b]">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white text-sm">{section.category}</h3>
                  </div>

                  <div className="space-y-3">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="font-mono font-semibold text-slate-100 text-right max-w-[60%] truncate">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Hardware Diagnostic Command Scripts */}
          <div className="p-6 rounded-3xl cyber-card border border-[#162752] space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" /> Technician Quick Audit One-Liners
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#080e22] border border-[#16254c] space-y-2">
                <span className="text-slate-300 font-semibold block">Generate Battery Health Report</span>
                <div className="flex items-center justify-between">
                  <code className="text-cyan-300 font-mono text-[11px]">powercfg /batteryreport</code>
                  <button
                    onClick={() => handleCopy('powercfg /batteryreport', 'audit-batt')}
                    className="text-cyan-400 hover:text-cyan-300 font-bold"
                  >
                    {copiedCmd === 'audit-batt' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#080e22] border border-[#16254c] space-y-2">
                <span className="text-slate-300 font-semibold block">Reboot Directly to UEFI BIOS</span>
                <div className="flex items-center justify-between">
                  <code className="text-cyan-300 font-mono text-[11px]">shutdown /r /fw /t 0</code>
                  <button
                    onClick={() => handleCopy('shutdown /r /fw /t 0', 'audit-fw')}
                    className="text-cyan-400 hover:text-cyan-300 font-bold"
                  >
                    {copiedCmd === 'audit-fw' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#080e22] border border-[#16254c] space-y-2">
                <span className="text-slate-300 font-semibold block">Suspend BitLocker (1 Reboot)</span>
                <div className="flex items-center justify-between">
                  <code className="text-cyan-300 font-mono text-[11px]">manage-bde -protectors -disable C: -rebootcount 1</code>
                  <button
                    onClick={() => handleCopy('manage-bde -protectors -disable C: -rebootcount 1', 'audit-bitlocker')}
                    className="text-cyan-400 hover:text-cyan-300 font-bold"
                  >
                    {copiedCmd === 'audit-bitlocker' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model Tech Dossier & Solution Modal */}
      {activeModelModal && (
        <ModelDetailsModal
          model={activeModelModal}
          onClose={() => setActiveModelModal(null)}
        />
      )}

    </div>
  );
}
