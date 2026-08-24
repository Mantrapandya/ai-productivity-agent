import React from 'react';
import { ListOrdered, Copy, Check, User } from 'lucide-react';
import { DailyPlanStep } from '../types';

interface DailyPlanCardProps {
  plan: DailyPlanStep[];
  onCopy: (text: string, label: string) => void;
  copiedLabel: string | null;
}

export const DailyPlanCard: React.FC<DailyPlanCardProps> = ({
  plan = [],
  onCopy,
  copiedLabel,
}) => {
  const isCopied = copiedLabel === 'Daily Plan';
  const planList = Array.isArray(plan) ? plan : [];

  const handleCopy = () => {
    const formatted = planList
      .map((p, idx) => `${p?.step || idx + 1}. ${p?.title || 'Action Tier'}\n   Action: ${p?.description || ''}\n   Owner: ${p?.assignee || 'Not specified'}`)
      .join('\n\n');
    onCopy(formatted, 'Daily Plan');
  };

  const getStepBadge = (step: number) => {
    switch (step) {
      case 1:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 2:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 3:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 4:
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl p-5 sm:p-6 transition-all hover:border-slate-700/80">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs font-mono">
            05
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-blue-400" />
              <span>Actionable Daily Plan</span>
            </h3>
            <p className="text-xs text-slate-400">
              Ordered 4-tier tactical execution sequence grounded in reported facts
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          title="Copy Daily Action Plan"
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
        {planList.map((item, index) => {
          return (
            <div
              key={index}
              className="relative flex items-start gap-3.5 p-3.5 rounded-xl bg-[#0D1322]/80 border border-slate-800/80 transition-colors hover:border-slate-700"
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono shrink-0 mt-0.5 border ${getStepBadge(
                  item?.step || index + 1
                )}`}
              >
                0{item?.step || index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    {item?.title || `Action Tier ${index + 1}`}
                  </h4>
                  {item?.assignee && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                      <User className="w-3 h-3 text-slate-500" />
                      <span>{item.assignee}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-200 font-normal mt-1 leading-relaxed">
                  {item?.description || ''}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
