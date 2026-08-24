import React from 'react';
import { Sparkles, History, HelpCircle, RotateCcw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'history' | 'about';
  onSelectTab: (tab: 'dashboard' | 'history' | 'about') => void;
  onNewAnalysis: () => void;
  hasResults: boolean;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onNewAnalysis,
  hasResults,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090D16]/80 backdrop-blur-xl border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title & Event Affiliation */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              OpsFlow<span className="text-indigo-400 font-normal ml-1 text-sm bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-md">AI</span>
            </span>
            <span className="hidden lg:inline-flex items-center text-xs font-medium text-slate-400 border-l border-slate-700/80 pl-2.5 whitespace-nowrap">
              Google Cloud Gen AI Academy APAC Edition 2026
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 border border-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {historyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onSelectTab('about')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'about'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Live Status Badge */}
        <div className="flex items-center gap-3 shrink-0">
          {hasResults && (
            <button
              onClick={onNewAnalysis}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 rounded-lg transition-all hover:text-white whitespace-nowrap shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset View</span>
            </button>
          )}

          {/* Live Status Badge with pulsing green dot */}
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] font-medium tracking-tight">Gemini 3.7 Flash</span>
          </div>
        </div>
      </div>
    </header>
  );
};
