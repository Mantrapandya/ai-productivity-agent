export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  deadline: string;
  priority: PriorityLevel;
  status: TaskStatus;
}

export interface PriorityInsight {
  item: string;
  urgency: string;
  rationale: string;
}

export interface BlockerItem {
  blocker: string;
  impact: string;
  severity: 'High' | 'Medium' | 'Low' | string;
}

export interface DailyPlanStep {
  step: number;
  title: string;
  description: string;
  assignee: string;
}

export interface FollowUpEmail {
  subject: string;
  body: string;
}

export interface OpsAnalysisResult {
  executiveSummary: string[];
  actionItems: ActionItem[];
  priorityInsights: PriorityInsight[];
  blockers: BlockerItem[];
  dailyPlan: DailyPlanStep[];
  followUpEmail: FollowUpEmail;
}

export interface AnalysisMeta {
  timestamp: string;
  charCount: number;
  taskCount: number;
  blockerCount: number;
}

export interface AnalysisHistoryItem {
  id: string;
  title: string;
  inputText: string;
  result: OpsAnalysisResult;
  timestamp: string;
  summaryPreview: string;
}
