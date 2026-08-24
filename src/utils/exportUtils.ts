import { OpsAnalysisResult } from '../types';
 
export function formatReportMarkdown(result: OpsAnalysisResult, rawInput?: string): string {
  const dateStr = new Date().toLocaleString();
  let md = `# OpsFlow AI — Daily Operations Report\n*Generated: ${dateStr}*\n\n`;

  if (rawInput) {
    md += `## Original Operational Update\n\`\`\`text\n${rawInput.trim()}\n\`\`\`\n\n`;
  }

  md += `## 1. Executive Summary\n`;
  const summaryPoints = result?.executiveSummary || [];
  summaryPoints.forEach((point, i) => {
    md += `${i + 1}. ${point}\n`;
  });
  md += `\n`;

  md += `## 2. Action Items Matrix\n`;
  md += `| Task | Assignee | Deadline | Priority | Status |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- |\n`;
  const actionItems = result?.actionItems || [];
  actionItems.forEach((item) => {
    const taskName = (item?.task || 'Task').replace(/\|/g, '-');
    md += `| ${taskName} | ${item?.assignee || 'Not specified'} | ${item?.deadline || 'No deadline'} | ${item?.priority || 'Medium'} | ${item?.status || 'Not Started'} |\n`;
  });
  md += `\n`;

  md += `## 3. Priority Insights & Rationale\n`;
  const priorityInsights = result?.priorityInsights || [];
  if (priorityInsights.length > 0) {
    priorityInsights.forEach((insight) => {
      md += `* **[${insight?.urgency || 'High'}] ${insight?.item || 'Priority Item'}**: ${insight?.rationale || ''}\n`;
    });
  } else {
    md += `* No specific high-urgency exceptions detected.\n`;
  }
  md += `\n`;

  md += `## 4. Blockers & Dependencies\n`;
  const blockers = result?.blockers || [];
  if (blockers.length > 0) {
    blockers.forEach((blocker) => {
      md += `* **[${blocker?.severity || 'Medium'}] ${blocker?.blocker || 'Blocker'}** — *Impact:* ${blocker?.impact || ''}\n`;
    });
  } else {
    md += `* No blockers identified.\n`;
  }
  md += `\n`;

  md += `## 5. Daily Action Plan\n`;
  const dailyPlan = result?.dailyPlan || [];
  dailyPlan.forEach((plan, sIdx) => {
    md += `### ${plan?.step || sIdx + 1}. ${plan?.title || 'Action'}\n`;
    md += `* **Action:** ${plan?.description || ''}\n`;
    md += `* **Owner:** ${plan?.assignee || 'Not specified'}\n\n`;
  });

  md += `## 6. Follow-Up Email Draft\n`;
  const emailSubject = result?.followUpEmail?.subject || 'Operations Follow-Up: Action Items & Priorities';
  const emailBody = result?.followUpEmail?.body || 'Please review the extracted action items and next steps.';
  md += `**Subject:** ${emailSubject}\n\n`;
  md += `\`\`\`text\n${emailBody}\n\`\`\`\n`;

  return md;
}

export function formatActionItemsTSV(items: OpsAnalysisResult['actionItems']): string {
  let tsv = 'Task\tAssignee\tDeadline\tPriority\tStatus\n';
  (items || []).forEach((item) => {
    tsv += `${item?.task || ''}\t${item?.assignee || 'Not specified'}\t${item?.deadline || 'No deadline'}\t${item?.priority || 'Medium'}\t${item?.status || 'Not Started'}\n`;
  });
  return tsv;
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator?.clipboard && typeof navigator.clipboard.writeText === 'function') {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopyText(text));
  }
  return Promise.resolve(fallbackCopyText(text));
}

function fallbackCopyText(text: string): boolean {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    return false;
  }
}

export function downloadMarkdownFile(content: string, filename = 'opsflow-analysis-report.md'): void {
  try {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Download error:', e);
  }
}
