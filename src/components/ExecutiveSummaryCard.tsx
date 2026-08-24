import React from 'react';
import { Target, Copy, Check } from 'lucide-react';

interface ExecutiveSummaryCardProps {
  summary: string[];
  onCopy: (text: string, label: string) => void;
  copiedLabel: string | null;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({
  summary = [],
  onCopy,
  copiedLabel,
}) => {
  const isCopied = copiedLabel === 'Executive Summary';
  const summaryList = Array.isArray(summary) ? summary : [];

  const handleCopy = () => {
    const formatted = summaryList.map((s, idx) => `${idx + 1}. ${s}`).join('\n');
    onCopy(formatted, 'Executive Summary');
  };

  return (
    <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl p-5 sm:p-6 transition-all hover:border-slate-700/80">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
            01
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              <span>Executive Operational Summary</span>
            </h3>
            <p className="text-xs text-slate-400">
              3 concise takeaways synthesized strictly from reported facts
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          title="Copy Executive Summary"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        {summaryList.slice(0, 3).map((bullet, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0D1322]/80 border border-slate-800/80 hover:border-slate-700/80 transition-colors"
          >
            <span className="w-5 h-5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {bullet}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
