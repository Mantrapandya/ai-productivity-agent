import React, { useState } from 'react';
import { Play, Sparkles, Trash2, ChevronDown, Check, Settings2, FileText, ArrowRight, Zap } from 'lucide-react';
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

  const quickPresets = SAMPLE_SCENARIOS.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero Value Proposition */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2 pb-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13192B] border border-[#1E2638] text-indigo-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Operational Intelligence Agent</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Turn updates into action.
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Paste meeting notes, project updates, shift reports, or daily logs. OpsFlow AI extracts key decisions, tasks, priorities, blockers, and a ready-to-send follow-up.
        </p>
      </div>

      {/* Visual Transformation Workflow Strip */}
      <div className="bg-[#111624] border border-[#1E2638] rounded-xl p-3 sm:p-3.5 max-w-3xl mx-auto shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#0B0F17]/60 border border-[#1E2638]">
            <span className="font-mono font-bold text-slate-400">01</span>
            <span className="text-slate-300 font-medium tracking-tight">Raw Updates</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#0B0F17]/60 border border-[#1E2638]">
            <span className="font-mono font-bold text-indigo-400">02</span>
            <span className="text-indigo-200 font-medium tracking-tight">AI Extraction</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#0B0F17]/60 border border-[#1E2638]">
            <span className="font-mono font-bold text-emerald-400">03</span>
            <span className="text-emerald-200 font-medium tracking-tight">Grounded Facts</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#0B0F17]/60 border border-[#1E2638]">
            <span className="font-mono font-bold text-purple-400">04</span>
            <span className="text-purple-200 font-medium tracking-tight">Daily Action Plan</span>
          </div>
        </div>
      </div>

      {/* Primary Input Card */}
      <div className="relative bg-[#111624] border border-[#1E2638] rounded-2xl shadow-xl overflow-hidden transition-all">
        {/* Subtle Top Accent */}
        <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-600 opacity-90" />

        {/* Card Header & Scenario Selector */}
        <div className="p-4 sm:p-5 border-b border-[#1E2638] flex flex-wrap items-center justify-between gap-3 bg-[#13192B]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Operational Input
              </h2>
              <p className="text-[11px] text-slate-400">
                Input unstructured text from meetings, shift handovers, or daily work logs
              </p>
            </div>
          </div>

          {/* Scenarios Dropdown & Clear */}
          <div className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sample Scenarios</span>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
            </button>

            {inputText && (
              <button
                type="button"
                onClick={onClear}
                title="Clear input"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#13192B] border border-[#1E2638] rounded-xl shadow-2xl z-30 py-2 divide-y divide-[#1E2638]">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Preset Scenario
                </div>
                <div className="max-h-72 overflow-y-auto py-1">
                  {SAMPLE_SCENARIOS.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => handleSelectScenario(scenario)}
                      className={`w-full text-left px-3.5 py-2.5 hover:bg-[#1C2438] transition-colors flex items-start gap-2.5 ${
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
        <div className="px-4 sm:px-5 py-2.5 bg-[#0B0F17] border-b border-[#1E2638] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Presets:</span>
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {quickPresets.map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap border ${
                  inputText === sc.text
                    ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40 shadow-xs'
                    : 'bg-[#111624] hover:bg-[#1C2438] text-slate-400 hover:text-slate-200 border-[#1E2638]'
                }`}
              >
                {sc.title}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="p-4 sm:p-5 space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => onChangeText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste your operational update here...&#10;&#10;Example:&#10;Daily operations update:&#10;The warehouse is running low on packaging material and may need a new order soon.&#10;Rahul will prepare the updated inventory report by Friday.&#10;Priya needs to review the latest sales numbers before the Monday team meeting.&#10;The client requested the revised proposal before Thursday.&#10;The marketing team is waiting for the product images from the design team."
            rows={8}
            className="w-full text-xs sm:text-sm text-slate-100 placeholder-slate-500 bg-[#0B0F17] border border-[#1E2638] rounded-xl p-4 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono leading-relaxed resize-y"
          />

          {/* Optional Focus Note */}
          {showAdvanced && (
            <div className="p-3.5 bg-[#0B0F17] rounded-xl border border-[#1E2638]">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Custom Focus / Scope Prompt (Optional)
              </label>
              <input
                type="text"
                value={focusNote}
                onChange={(e) => setFocusNote(e.target.value)}
                placeholder="e.g., Prioritize supply chain packaging shortage, keep email concise"
                className="w-full text-xs text-slate-200 bg-[#111624] border border-[#1E2638] rounded-lg px-3 py-2 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          )}

          {/* Footer Metrics & CTA Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#1E2638]">
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="bg-[#0B0F17] px-2 py-0.5 rounded text-slate-300 border border-[#1E2638]">
                {charCount} chars
              </span>
              <span className="bg-[#0B0F17] px-2 py-0.5 rounded text-slate-300 border border-[#1E2638]">
                {wordCount} words
              </span>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-sans font-medium inline-flex items-center gap-1 transition-colors"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Hide scope' : 'Add scope'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-[11px] text-slate-500 font-mono">
                <kbd className="px-2 py-0.5 bg-[#0B0F17] border border-[#1E2638] rounded text-[10px] text-slate-400">
                  ⌘/Ctrl + Enter
                </kbd>
              </span>
              <button
                type="button"
                disabled={isLoading || !inputText.trim()}
                onClick={() => onAnalyze(focusNote)}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-150 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Agent Analyzing Input...</span>
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
    </div>
  );
};

