import React from 'react';
import { AlertTriangle, Copy, Check, Flame, Clock } from 'lucide-react';
import { PriorityInsight } from '../types';

interface PriorityInsightsCardProps {
  insights: PriorityInsight[];
  onCopy: (text: string, label: string) => void;
  copiedLabel: string | null;
}

export const PriorityInsightsCard: React.FC<PriorityInsightsCardProps> = ({
  insights = [],
  onCopy,
  copiedLabel,
}) => {
  const isCopied = copiedLabel === 'Priority Insights';
  const insightsList = Array.isArray(insights) ? insights : [];

  const handleCopy = () => {
    const formatted = insightsList
      .map((ins) => `* [${ins?.urgency || 'High'}] ${ins?.item || 'Priority Item'}: ${ins?.rationale || ''}`)
      .join('\n');
    onCopy(formatted, 'Priority Insights');
  };

  return (
    <div className="bg-[#111624] border border-[#1E2638] rounded-2xl p-5 sm:p-6 shadow-xl transition-all">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1E2638]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
            02
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Priority Insights & Urgency Rationale</span>
            </h3>
            <p className="text-xs text-slate-400">
              High-impact items with evidence grounded strictly in provided input
            </p>
          </div>
        </div>

        {insightsList.length > 0 && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#13192B] hover:bg-[#1C2438] border border-[#1E2638] rounded-lg transition-colors whitespace-nowrap"
            title="Copy Priority Insights"
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
        )}
      </div>

      {insightsList.length === 0 ? (
        <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E2638] text-center text-xs text-slate-400">
          No high-urgency exceptions detected in the current operational update.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insightsList.map((insight, idx) => {
            const urgencyStr = String(insight?.urgency || 'High');
            const isHigh =
              urgencyStr.toLowerCase().includes('high') ||
              urgencyStr.toLowerCase().includes('critical');

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isHigh
                    ? 'bg-rose-950/15 border-rose-500/25 hover:border-rose-500/40'
                    : 'bg-amber-950/15 border-amber-500/25 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isHigh
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {isHigh ? (
                      <Flame className="w-3 h-3 text-rose-400" />
                    ) : (
                      <Clock className="w-3 h-3 text-amber-400" />
                    )}
                    <span>{urgencyStr} Urgency</span>
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-white mb-2 leading-snug">
                  {insight?.item || 'Priority Item'}
                </h4>

                <div className="text-xs bg-[#0B0F17] rounded-lg p-2.5 border border-[#1E2638]">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                    Grounding Evidence:
                  </span>
                  <p className="leading-relaxed text-slate-300 text-xs">{insight?.rationale || 'Grounding derived from operational update.'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

