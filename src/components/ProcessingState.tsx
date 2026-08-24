import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Sparkles, Database, Cpu, ShieldCheck, Layers } from 'lucide-react';

const STAGES = [
  { label: 'Ingesting raw operational stream & normalizing structure', icon: Database },
  { label: 'Gemini 3.7 schema-constrained extraction & reasoning', icon: Cpu },
  { label: 'Zero-hallucination verification against reported facts', icon: ShieldCheck },
  { label: 'Synthesizing matrix, plan, email & action priorities', icon: Layers },
];

export const ProcessingState: React.FC = () => {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 650);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl my-6 overflow-hidden">
      {/* Ambient glow accent */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/10">
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Synthesizing Operational Intelligence</span>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Live Pipeline
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Grounded multi-tier extraction via Gemini 3.7 Flash
            </p>
          </div>
        </div>
        <div className="text-xs font-mono text-indigo-300 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-lg">
          Stage {currentStageIdx + 1} of {STAGES.length}
        </div>
      </div>

      {/* Stages list */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;
          const isPending = idx > currentStageIdx;
          const Icon = stage.icon;

          return (
            <div
              key={stage.label}
              className={`p-3.5 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? 'bg-indigo-950/40 border-indigo-500/40 shadow-md shadow-indigo-950/60 ring-1 ring-indigo-500/30'
                  : isDone
                  ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                  : 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isCurrent
                      ? 'bg-indigo-500 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </span>
                <Icon
                  className={`w-4 h-4 ${
                    isCurrent ? 'text-indigo-400 animate-pulse' : isDone ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
              </div>
              <p className={`text-xs font-medium leading-snug line-clamp-2 ${isCurrent ? 'text-white font-semibold' : 'text-slate-300'}`}>
                {stage.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Skeleton Pulse */}
      <div className="mt-6 pt-5 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-2">
          <div className="h-3 w-32 bg-slate-800 rounded" />
          <div className="h-2.5 w-full bg-slate-800/60 rounded" />
          <div className="h-2.5 w-4/5 bg-slate-800/60 rounded" />
        </div>
        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-2">
          <div className="h-3 w-28 bg-slate-800 rounded" />
          <div className="h-2.5 w-full bg-slate-800/60 rounded" />
          <div className="h-2.5 w-3/4 bg-slate-800/60 rounded" />
        </div>
      </div>
    </div>
  );
};
