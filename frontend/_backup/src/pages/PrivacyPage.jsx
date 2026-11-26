import React, { useState } from 'react';
import { Fingerprint, Lock, ShieldCheck, Trash2, CheckCircle2, Sliders, RefreshCw, Sparkles } from 'lucide-react';

export default function PrivacyPage() {
  const [cookiesBlocked, setCookiesBlocked] = useState(126);
  const [telemetryLevel, setTelemetryLevel] = useState('Minimal (Security Only)');
  const [browserProtection, setBrowserProtection] = useState(true);
  const [antiFingerprinting, setAntiFingerprinting] = useState(true);
  const [clipboardClearing, setClipboardClearing] = useState(true);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleaned, setCleaned] = useState(false);

  const handleCleanTraces = () => {
    setIsCleaning(true);
    setTimeout(() => {
      setIsCleaning(false);
      setCleaned(true);
      setCookiesBlocked(0);
      setTimeout(() => setCleaned(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#14234b]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Fingerprint className="w-6 h-6 text-teal-400" />
            Spyware & Privacy Shield
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Neutralize cross-site tracking cookies, block Windows diagnostic telemetry, and prevent digital browser fingerprinting.
          </p>
        </div>
        <button
          onClick={handleCleanTraces}
          disabled={isCleaning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/25 transition disabled:opacity-50"
        >
          {isCleaning ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Trash2 className="w-4 h-4" />}
          {isCleaning ? 'Purging Traces...' : 'Clean All Privacy Traces'}
        </button>
      </div>

      {cleaned && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-slide-up">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>All 126 tracking cookies, clipboard memory buffers, and DNS query history have been shredded successfully.</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl cyber-card border border-[#162752] space-y-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Tracking Cookies Found</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{cookiesBlocked}</span>
            <span className="text-xs text-slate-400">across 4 browsers</span>
          </div>
          <p className="text-[11px] text-slate-400">Google, Meta, and third-party advertising tracking beacons.</p>
        </div>

        <div className="p-5 rounded-3xl cyber-card border border-[#162752] space-y-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Telemetry Data Leakage</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-400">Restricted</span>
          </div>
          <p className="text-[11px] text-slate-400">DiagTrack service is blocked from sending hardware telemetries.</p>
        </div>

        <div className="p-5 rounded-3xl cyber-card border border-[#162752] space-y-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Browser Fingerprint</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-cyan-400">Randomized</span>
          </div>
          <p className="text-[11px] text-slate-400">Canvas and WebGL spoofing prevents profiling of your GPU.</p>
        </div>
      </div>

      {/* Interactive Privacy Protection Switches */}
      <div className="p-6 rounded-3xl cyber-card border border-[#162752] space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Privacy Protection Controls
        </h3>

        <div className="divide-y divide-[#14234b] space-y-4">
          <div className="pt-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Browser Real-time Protection</p>
              <p className="text-[11px] text-slate-400">Blocks known phishing domains and credential harvesting scripts before load.</p>
            </div>
            <button
              onClick={() => setBrowserProtection(!browserProtection)}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${browserProtection ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'}`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow"></div>
            </button>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Anti-Tracking & Cookie Shredder</p>
              <p className="text-[11px] text-slate-400">Automatically shreds tracking cookies upon browser closing.</p>
            </div>
            <button
              onClick={() => setAntiFingerprinting(!antiFingerprinting)}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${antiFingerprinting ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'}`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow"></div>
            </button>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Clipboard History Auto-Clear</p>
              <p className="text-[11px] text-slate-400">Wipes copied passwords and tokens from memory after 10 minutes.</p>
            </div>
            <button
              onClick={() => setClipboardClearing(!clipboardClearing)}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${clipboardClearing ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'}`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
