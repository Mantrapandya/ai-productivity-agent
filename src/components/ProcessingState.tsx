import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Sparkles, Database, Cpu, ShieldCheck, Layers } from 'lucide-react';

const STAGES = [
  { id: '01', phase: 'INGEST', label: 'Ingesting raw operational stream & normalizing structure', icon: Database },
  { id: '02', phase: 'EXTRACT', label: 'Schema-constrained extraction of tasks, owners & deadlines', icon: Cpu },
  { id: '03', phase: 'VERIFY', label: 'Zero-hallucination verification against reported facts', icon: ShieldCheck },
  { id: '04', phase: 'SYNTHESIZE', label: 'Synthesizing matrix, plan, email & action priorities', icon: Layers },
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
    <div className="relative bg-[#111624] border border-[#1E2638] rounded-2xl p-5 sm:p-7 shadow-2xl my-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#1E2638]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                OpsFlow Agent Processing
              </h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Phase {currentStageIdx + 1}/4
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict deterministic extraction in progress...
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#0B0F17] border border-[#1E2638] px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          <span>{STAGES[currentStageIdx].phase}</span>
        </div>
      </div>

      {/* 4 Pipeline Stages */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;
          const isPending = idx > currentStageIdx;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className={`p-3.5 rounded-xl border transition-all duration-200 ${
                isCurrent
                  ? 'bg-indigo-950/30 border-indigo-500/40 shadow-sm ring-1 ring-indigo-500/20'
                  : isDone
                  ? 'bg-[#0B0F17] border-[#1E2638] text-slate-300'
                  : 'bg-[#0B0F17]/40 border-[#1E2638]/50 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isCurrent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : stage.id}
                  </span>
                  <span className={`text-[10px] font-bold font-mono tracking-wider ${isCurrent ? 'text-indigo-300' : isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {stage.phase}
                  </span>
                </div>

                <Icon
                  className={`w-3.5 h-3.5 ${
                    isCurrent ? 'text-indigo-400 animate-pulse' : isDone ? 'text-emerald-400' : 'text-slate-700'
                  }`}
                />
              </div>

              <p className={`text-xs font-medium leading-snug line-clamp-2 ${isCurrent ? 'text-slate-100 font-semibold' : isDone ? 'text-slate-300' : 'text-slate-500'}`}>
                {stage.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Skeleton Pulse preview */}
      <div className="mt-5 pt-4 border-t border-[#1E2638] grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-60 animate-pulse">
        <div className="p-3.5 bg-[#0B0F17] rounded-xl border border-[#1E2638] space-y-2">
          <div className="h-2.5 w-28 bg-slate-700 rounded" />
          <div className="h-2 w-full bg-slate-800 rounded" />
          <div className="h-2 w-4/5 bg-slate-800 rounded" />
        </div>
        <div className="p-3.5 bg-[#0B0F17] rounded-xl border border-[#1E2638] space-y-2">
          <div className="h-2.5 w-32 bg-slate-700 rounded" />
          <div className="h-2 w-full bg-slate-800 rounded" />
          <div className="h-2 w-3/4 bg-slate-800 rounded" />
        </div>
      </div>
    </div>
  );
};

