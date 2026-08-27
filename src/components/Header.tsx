import React from 'react';
import { Sparkles, History, Layers, RotateCcw, Cpu } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'history' | 'about';
  onSelectTab: (tab: 'dashboard' | 'history' | 'about') => void;
  onNewAnalysis: () => void;
  hasResults: boolean;
  historyCount: number;
  isLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onNewAnalysis,
  hasResults,
  historyCount,
  isLoading = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/90 backdrop-blur-xl border-b border-[#1E2638] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 border border-indigo-400/30">
            <Cpu className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex items-baseline gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-white">
                OpsFlow
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                AI Agent
              </span>
            </div>
            <span className="hidden xl:inline-flex items-center text-xs text-slate-400 border-l border-slate-700/80 pl-2.5">
              Google Cloud Gen AI Academy APAC Edition 2026
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#111624] border border-[#1E2638] p-1 rounded-xl">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Saved Briefs</span>
            <span className="sm:hidden">History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {historyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onSelectTab('about')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'about'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Architecture</span>
            <span className="sm:hidden">Info</span>
          </button>
        </nav>

        {/* Status Pill & Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {hasResults && (
            <button
              onClick={onNewAnalysis}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-[#13192B] hover:bg-[#1C2438] border border-[#1E2638] rounded-lg transition-all hover:text-white whitespace-nowrap shadow-xs"
              title="Start a new operational analysis"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">New Brief</span>
            </button>
          )}

          {/* Real System Status Pill */}
          <div className="flex items-center gap-2 text-xs font-medium bg-[#111624] border border-[#1E2638] px-3 py-1.5 rounded-lg">
            {isLoading ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="font-mono text-[11px] text-indigo-300">Agent Analyzing</span>
              </>
            ) : hasResults ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span className="font-mono text-[11px] text-emerald-400">Brief Ready</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span className="font-mono text-[11px] text-slate-300">Agent Ready</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

