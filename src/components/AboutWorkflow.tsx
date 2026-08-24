import React from 'react';
import { Sparkles, ShieldCheck, Zap, Layers, Cpu, CheckCircle2 } from 'lucide-react';

export const AboutWorkflow: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Overview */}
      <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Google Cloud Gen AI Academy APAC Edition 2026</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          OpsFlow AI: Transforming Operational Chaos into Structured Execution
        </h2>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl">
          OpsFlow AI acts as a dedicated operations intelligence copilot. It ingests messy, unstructured inputs like standup notes, shift handovers, and daily logs, and applies strict grounded extraction to synthesize deterministic business intelligence without guessing.
        </p>

        {/* Workflow Diagram */}
        <div className="mt-8 p-5 bg-[#0A0E1A] rounded-xl border border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono">
            Deterministic Pipeline Architecture
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
              <div className="text-xs font-bold text-white font-mono">01. Ingestion</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Raw unstructured text</div>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
              <div className="text-xs font-bold text-indigo-300 font-mono">02. Gemini AI</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Strict schema extraction</div>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
              <div className="text-xs font-bold text-emerald-300 font-mono">03. Verification</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Zero-hallucination checks</div>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
              <div className="text-xs font-bold text-purple-300 font-mono">04. Execution</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Interactive board & email</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grounding Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Strict Operational Grounding</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            OpsFlow never invents task owners, imaginary deadlines, or phantom metrics. If an assignee or due date is omitted in the raw text, it is unambiguously flagged as "Not specified" or "No deadline".
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Instant Team Distribution</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Exports directly to Markdown, TSV for Excel/Google Sheets, formatted email drafts with automatic mail client hooks, and print-ready operational briefing sheets.
          </p>
        </div>
      </div>
    </div>
  );
};
