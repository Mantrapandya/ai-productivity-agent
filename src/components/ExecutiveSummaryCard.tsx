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
    <div className="bg-[#111624] border border-[#1E2638] rounded-2xl p-5 sm:p-6 shadow-xl transition-all">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1E2638]">
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
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#13192B] hover:bg-[#1C2438] border border-[#1E2638] rounded-lg transition-colors whitespace-nowrap"
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

      <div className="space-y-2.5">
        {summaryList.slice(0, 3).map((bullet, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0B0F17] border border-[#1E2638] hover:border-slate-700/60 transition-colors"
          >
            <span className="w-5 h-5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              {bullet}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

