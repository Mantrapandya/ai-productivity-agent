import React, { useState } from 'react';
import { Play, Sparkles, Trash2, FileText, ChevronDown, Check, Settings2, Terminal, Zap } from 'lucide-react';
import { SAMPLE_SCENARIOS, SampleScenario } from '../data/sampleData';

interface InputPanelProps {
  inputText: string;
  onChangeText: (text: string) => void;
  onAnalyze: (focusNote?: string) => void;
  isLoading: boolean;
  onClear: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  inputText,
  onChangeText,
  onAnalyze,
  isLoading,
  onClear,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('benchmark-ops');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [focusNote, setFocusNote] = useState<string>('');

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const handleSelectScenario = (scenario: SampleScenario) => {
    setSelectedScenarioId(scenario.id);
    onChangeText(scenario.text);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && inputText.trim()) {
        onAnalyze(focusNote);
      }
    }
  };

  // Top 3 Quick Demo Presets
  const quickPresets = SAMPLE_SCENARIOS.slice(0, 3);

  return (
    <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden transition-all">
      {/* Ambient gradient line at top of card */}
      <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 opacity-80" />

      {/* Top Header */}
      <div className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 bg-slate-900/40">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Terminal className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold tracking-tight text-white uppercase tracking-wider">
              Operational Input Stream
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Raw meeting notes, shift reports, daily work logs, or cross-team sync updates
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>All Scenarios ({SAMPLE_SCENARIOS.length})</span>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-400 transition-transform" />
            </button>

            {inputText && (
              <button
                type="button"
                onClick={onClear}
                title="Clear input text"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-30 py-2 divide-y divide-slate-800 backdrop-blur-xl">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select Operational Scenario
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {SAMPLE_SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => handleSelectScenario(scenario)}
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-slate-800/70 transition-colors flex items-start gap-2.5 ${
                      selectedScenarioId === scenario.id ? 'bg-indigo-600/15 border-l-2 border-indigo-500' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-200 truncate">
                          {scenario.title}
                        </span>
                        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                          {scenario.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {scenario.description}
                      </p>
                    </div>
                    {selectedScenarioId === scenario.id && (
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Demo Preset Pills */}
      <div className="px-5 sm:px-6 py-2.5 bg-[#0A0E1A] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Quick Presets:</span>
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap">
          {quickPresets.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap border ${
                inputText === sc.text
                  ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40 shadow-xs'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              {sc.title}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea Area */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => onChangeText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste your operational update here...&#10;&#10;Example:&#10;Daily operations update:&#10;The warehouse is running low on packaging material and may need a new order soon.&#10;Rahul will prepare the updated inventory report by Friday.&#10;Priya needs to review the latest sales numbers before the Monday team meeting.&#10;The client requested the revised proposal before Thursday.&#10;The marketing team is waiting for the product images from the design team."
            rows={7}
            className="w-full text-xs sm:text-sm text-slate-100 placeholder-slate-500 bg-[#0D1322] border border-slate-800 rounded-xl p-4 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono leading-relaxed resize-y shadow-inner"
          />
        </div>

        {/* Optional Custom Focus */}
        {showAdvanced && (
          <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Custom Prompt Focus / Scope Context (Optional)
            </label>
            <input
              type="text"
              value={focusNote}
              onChange={(e) => setFocusNote(e.target.value)}
              placeholder="e.g., Emphasize warehouse supply chain, make email tone executive-ready"
              className="w-full text-xs text-slate-200 bg-[#0D1322] border border-slate-800 rounded-lg px-3 py-2 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Footer controls & CTA button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="bg-slate-800/80 px-2 py-0.5 rounded text-slate-300 border border-slate-700/50">
              {charCount} chars
            </span>
            <span className="bg-slate-800/80 px-2 py-0.5 rounded text-slate-300 border border-slate-700/50">
              {wordCount} words
            </span>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-sans font-medium inline-flex items-center gap-1 transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide options' : 'Options'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] text-slate-500 font-mono">
              <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-400">
                ⌘/Ctrl + Enter
              </kbd>
            </span>
            <button
              type="button"
              disabled={isLoading || !inputText.trim()}
              onClick={() => onAnalyze(focusNote)}
              className="relative group inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Intelligence...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Analyze Operations</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
