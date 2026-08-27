import React from 'react';
import { ShieldAlert, CheckCircle, Copy, Check, GitPullRequest } from 'lucide-react';
import { BlockerItem } from '../types';

interface BlockersCardProps {
  blockers: BlockerItem[];
  onCopy: (text: string, label: string) => void;
  copiedLabel: string | null;
}

export const BlockersCard: React.FC<BlockersCardProps> = ({
  blockers = [],
  onCopy,
  copiedLabel,
}) => {
  const isCopied = copiedLabel === 'Blockers & Dependencies';
  const blockersList = Array.isArray(blockers) ? blockers : [];

  const handleCopy = () => {
    if (blockersList.length === 0) {
      onCopy('No blockers identified.', 'Blockers & Dependencies');
      return;
    }
    const formatted = blockersList
      .map((b) => `* [${b?.severity || 'Medium'}] ${b?.blocker || 'Blocker'} — Impact: ${b?.impact || ''}`)
      .join('\n');
    onCopy(formatted, 'Blockers & Dependencies');
  };

  return (
    <div className="bg-[#111624] border border-[#1E2638] rounded-2xl p-5 sm:p-6 shadow-xl transition-all">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1E2638]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs font-mono">
            04
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Blockers & Operational Dependencies</span>
            </h3>
            <p className="text-xs text-slate-400">
              Inter-team waiting states, supply constraints, and critical bottlenecks
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#13192B] hover:bg-[#1C2438] border border-[#1E2638] rounded-lg transition-colors whitespace-nowrap"
          title="Copy Blockers"
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

      {blockersList.length === 0 ? (
        <div className="p-4 rounded-xl bg-emerald-950/15 border border-emerald-500/25 flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-emerald-300">
              No blockers identified.
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              All operations are progressing without stated external bottlenecks or missing prerequisites.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {blockersList.map((item, idx) => {
            const severityStr = String(item?.severity || 'Medium');
            const isHigh = severityStr.toLowerCase().includes('high');

            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#1E2638] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700/60 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                      isHigh
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    <GitPullRequest className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        {item?.blocker || 'Operational Blocker'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          isHigh
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {severityStr} Severity
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-300 font-mono text-[10px] uppercase">Impact:</span>
                      <span>{item?.impact || 'Delays operational progression.'}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

