import React from 'react';
import { Copy, FileDown, RotateCcw, Share2, Check } from 'lucide-react';
import { OpsAnalysisResult } from '../types';
import { formatReportMarkdown, downloadMarkdownFile } from '../utils/exportUtils';

interface QuickActionsBarProps {
  result: OpsAnalysisResult;
  rawInput: string;
  onCopy: (text: string, label: string) => void;
  onNewAnalysis: () => void;
  copiedLabel: string | null;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  result,
  rawInput,
  onCopy,
  onNewAnalysis,
  copiedLabel,
}) => {
  const handleCopySummary = () => {
    const summaryList = result?.executiveSummary || [];
    const text = summaryList.map((s, i) => `${i + 1}. ${s}`).join('\n');
    onCopy(text, 'Executive Summary');
  };

  const handleCopyActionItems = () => {
    let md = '| Task | Assignee | Deadline | Priority | Status |\n';
    md += '| :--- | :--- | :--- | :--- | :--- |\n';
    const actionItems = result?.actionItems || [];
    actionItems.forEach((item) => {
      md += `| ${(item?.task || 'Task').replace(/\|/g, '-')} | ${item?.assignee || 'Not specified'} | ${item?.deadline || 'No deadline'} | ${item?.priority || 'Medium'} | ${item?.status || 'Not Started'} |\n`;
    });
    onCopy(md, 'Action Items');
  };

  const handleCopyDailyPlan = () => {
    const dailyPlan = result?.dailyPlan || [];
    const text = dailyPlan
      .map((p, idx) => `${p?.step || idx + 1}. ${p?.title || 'Action'}: ${p?.description || ''} (Owner: ${p?.assignee || 'Not specified'})`)
      .join('\n\n');
    onCopy(text, 'Daily Plan');
  };

  const handleCopyEmail = () => {
    const emailSubject = result?.followUpEmail?.subject || 'Operations Follow-Up: Action Items & Priorities';
    const emailBody = result?.followUpEmail?.body || 'Please review the extracted action items and next steps.';
    const text = `Subject: ${emailSubject}\n\n${emailBody}`;
    onCopy(text, 'Follow-Up Email');
  };

  const handleCopyFullReport = () => {
    const report = formatReportMarkdown(result, rawInput);
    onCopy(report, 'Full Operations Report');
  };

  const handleDownloadMarkdown = () => {
    const report = formatReportMarkdown(result, rawInput);
    downloadMarkdownFile(report, `opsflow-report-${new Date().toISOString().slice(0, 10)}.md`);
  };

  return (
    <div className="bg-[#111624] border border-[#1E2638] rounded-2xl p-4 sm:p-5 shadow-xl transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left info */}
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span>Operational Distribution Controls</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            1-click clipboard exports and structured file distribution
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#13192B] hover:bg-[#1C2438] border border-[#1E2638] rounded-lg transition-colors whitespace-nowrap"
          >
            {copiedLabel === 'Executive Summary' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Summary</span>
          </button>

          <button
            type="button"
            onClick={handleCopyActionItems}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#13192B] hover:bg-[#1C2438] border border-[#1E2638] rounded-lg transition-colors whitespace-nowrap"
          >
            {copiedLabel === 'Action Items' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Tasks</span>
          </button>

          <button
            type="button"
            onClick={handleCopyDailyPlan}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#13192B] hover:bg-[#1C2438] border border-[#1E2638] rounded-lg transition-colors whitespace-nowrap"
          >
            {copiedLabel === 'Daily Plan' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Daily Plan</span>
          </button>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-all whitespace-nowrap"
          >
            {copiedLabel === 'Follow-Up Email' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Email</span>
          </button>

          <div className="h-5 w-px bg-[#1E2638] hidden sm:block mx-1" />

          <button
            type="button"
            onClick={handleCopyFullReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg transition-all whitespace-nowrap"
            title="Copy entire formatted markdown report"
          >
            {copiedLabel === 'Full Operations Report' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <FileDown className="w-3.5 h-3.5" />
            )}
            <span>Full Report</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#13192B] hover:bg-[#1C2438] border border-[#1E2638] rounded-lg transition-colors whitespace-nowrap"
            title="Download .md file"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export .md</span>
          </button>

          <button
            type="button"
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all whitespace-nowrap ml-auto sm:ml-0 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Ingestion</span>
          </button>
        </div>
      </div>
    </div>
  );
};

