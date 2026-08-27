import { GoogleGenAI } from '@google/genai';

// Response Schema Definition for Gemini Structured Output
export const analysisResponseSchema = {
  type: 'OBJECT',
  properties: {
    executiveSummary: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Exactly 3 concise bullet points identifying critical updates.',
    },
    actionItems: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          task: { type: 'STRING', description: 'Clear actionable task.' },
          assignee: { type: 'STRING', description: 'Explicit assignee or "Not specified".' },
          deadline: { type: 'STRING', description: 'Explicit deadline or "No deadline".' },
          priority: { type: 'STRING', description: 'High, Medium, or Low.' },
          status: { type: 'STRING', description: 'Default "Not Started".' },
        },
        required: ['task', 'assignee', 'deadline', 'priority', 'status'],
      },
      description: 'Extracted operational action items.',
    },
    priorityInsights: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          item: { type: 'STRING', description: 'Priority item title.' },
          urgency: { type: 'STRING', description: 'Urgency level (e.g. Critical, High, Moderate).' },
          rationale: { type: 'STRING', description: 'Grounded rationale from source text.' },
        },
        required: ['item', 'urgency', 'rationale'],
      },
      description: 'Strategic priority insights with grounded reasoning.',
    },
    blockers: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          blocker: { type: 'STRING', description: 'Blocker/dependency description.' },
          impact: { type: 'STRING', description: 'Operational impact.' },
          severity: { type: 'STRING', description: 'High, Medium, or Low.' },
        },
        required: ['blocker', 'impact', 'severity'],
      },
      description: 'Blockers and resource constraints. Return empty array if none.',
    },
    dailyPlan: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          step: { type: 'INTEGER', description: 'Step number (1, 2, 3, 4).' },
          title: { type: 'STRING', description: 'Tier title.' },
          description: { type: 'STRING', description: 'Tactical action derived from input.' },
          assignee: { type: 'STRING', description: 'Assignee or "Not specified".' },
        },
        required: ['step', 'title', 'description', 'assignee'],
      },
      description: 'Ordered 4-tier daily action plan based on user facts.',
    },
    followUpEmail: {
      type: 'OBJECT',
      properties: {
        subject: { type: 'STRING', description: 'Professional subject line.' },
        body: { type: 'STRING', description: 'Complete follow-up email text.' },
      },
      required: ['subject', 'body'],
      description: 'Professional follow-up email communication.',
    },
  },
  required: ['executiveSummary', 'actionItems', 'priorityInsights', 'blockers', 'dailyPlan', 'followUpEmail'],
};

let cachedClient: GoogleGenAI | null = null;
let cachedKey: string | null = null;

function getAiClient(apiKey: string): GoogleGenAI {
  if (cachedClient && cachedKey === apiKey) {
    return cachedClient;
  }
  cachedClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  cachedKey = apiKey;
  return cachedClient;
}

export async function executeOperationsAnalysis(text: string, focusNote?: string) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('Please enter an operational update before analyzing.');
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please ensure GEMINI_API_KEY is added to your environment variables.');
  }

  const aiClient = getAiClient(apiKey);

  const systemInstruction = `You are OpsFlow AI, an elite Operations Productivity Agent for Google Cloud Gen AI Academy APAC Edition 2026.
Transform unstructured operational text into structured intelligence with ZERO hallucination and strict grounding.

CRITICAL RULES:
1. ONLY use information explicitly stated in the input. NEVER invent people, tasks, or deadlines.
2. If assignee is missing, use exactly "Not specified". If deadline is missing, use exactly "No deadline".
3. executiveSummary: Exactly 3 concise bullet points identifying the most critical operational updates.
4. actionItems: Extract all distinct tasks. Priority must strictly be "High", "Medium", or "Low". Set status to "Not Started".
5. priorityInsights: Highlight urgent high-impact items with grounded rationale from text.
6. blockers: Identify bottlenecks, resource constraints, or waiting states. Return [] if none.
7. dailyPlan: 4-tier ordered tactical plan:
   - Tier 1: Immediate urgent operations
   - Tier 2: Scheduled deliverables/deadlines
   - Tier 3: Blocking dependencies
   - Tier 4: Remaining tasks/routine follow-ups
8. followUpEmail: Complete professional email with Subject, Greeting, Action Items, Deadlines, Next Steps, and Closing.`;

  const userPrompt = `Operational Update to Process:\n"""\n${text.trim()}\n"""${focusNote ? `\n\nAdditional Focus / Context Note: ${focusNote}` : ''}\n\nExecute the full operations intelligence extraction into the specified JSON format.`;

  // Candidate model hierarchy with ultra-low-latency configuration
  const candidateModels = [
    'gemini-3.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.5-flash',
    'gemini-3.6-flash',
    'gemini-3.7-flash',
  ];

  let response: any = null;
  let lastError: any = null;

  for (const model of candidateModels) {
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        const isReasoningModel = model.includes('3.7');
        const config: any = {
          systemInstruction,
          temperature: 0.1,
          responseMimeType: 'application/json',
          responseSchema: analysisResponseSchema as any,
        };

        if (isReasoningModel) {
          config.thinkingConfig = { thinkingBudget: 0 };
        }

        response = await aiClient.models.generateContent({
          model,
          contents: userPrompt,
          config,
        });

        if (response?.text) {
          break; // Successfully generated
        }
      } catch (err: any) {
        lastError = err;
        const status = err?.status || err?.code || '';
        const message = String(err?.message || '');

        const isTransient =
          status === 503 ||
          status === 429 ||
          status === 'UNAVAILABLE' ||
          status === 'RESOURCE_EXHAUSTED' ||
          message.includes('503') ||
          message.includes('429') ||
          message.includes('demand') ||
          message.includes('quota');

        if (isTransient && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 300 * attempts));
          continue;
        }
        break; // Move to next candidate model immediately
      }
    }

    if (response?.text) {
      break;
    }
  }

  if (!response || !response.text) {
    throw lastError || new Error('All model candidates failed to generate a response. Please try again.');
  }

  let rawText = response.text || '';
  if (!rawText.trim()) {
    throw new Error('Empty response received from Gemini model.');
  }

  // Strip markdown code block fences if present
  rawText = rawText.trim();
  if (rawText.startsWith('```json')) {
    rawText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (rawText.startsWith('```')) {
    rawText = rawText.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        throw new Error('AI returned an unparseable response structure. Please try again.');
      }
    } else {
      throw new Error('AI returned an invalid response structure. Please try again.');
    }
  }

  // Ensure executiveSummary has exactly 3 items
  if (!Array.isArray(parsed.executiveSummary) || parsed.executiveSummary.length === 0) {
    parsed.executiveSummary = [
      'Operational update processed.',
      'Review action items and deadlines below.',
      'Follow up on identified dependencies.',
    ];
  } else if (parsed.executiveSummary.length > 3) {
    parsed.executiveSummary = parsed.executiveSummary.slice(0, 3);
  } else if (parsed.executiveSummary.length < 3) {
    while (parsed.executiveSummary.length < 3) {
      parsed.executiveSummary.push('Review operational priorities and coordinate with team owners.');
    }
  }

  // Validate action items
  if (!Array.isArray(parsed.actionItems)) {
    parsed.actionItems = [];
  }
  parsed.actionItems = parsed.actionItems.map((item: any, idx: number) => ({
    id: item.id || `task-${idx + 1}-${Date.now()}`,
    task: String(item.task || 'Unspecified task').trim(),
    assignee: String(item.assignee || 'Not specified').trim(),
    deadline: String(item.deadline || 'No deadline').trim(),
    priority: ['High', 'Medium', 'Low'].includes(item.priority) ? item.priority : 'Medium',
    status: item.status || 'Not Started',
  }));

  // Validate priority insights
  if (!Array.isArray(parsed.priorityInsights)) {
    parsed.priorityInsights = [];
  } else {
    parsed.priorityInsights = parsed.priorityInsights.map((ins: any) => ({
      item: String(ins.item || 'Operational Priority').trim(),
      urgency: String(ins.urgency || 'High').trim(),
      rationale: String(ins.rationale || 'Identified based on reported operational update.').trim(),
    }));
  }

  // Validate blockers
  if (!Array.isArray(parsed.blockers)) {
    parsed.blockers = [];
  } else {
    parsed.blockers = parsed.blockers.map((b: any) => ({
      blocker: String(b.blocker || 'Operational Dependency').trim(),
      impact: String(b.impact || 'Delays associated task or team progression.').trim(),
      severity: ['High', 'Medium', 'Low'].includes(b.severity) ? b.severity : 'Medium',
    }));
  }

  // Validate daily plan
  if (!Array.isArray(parsed.dailyPlan)) {
    parsed.dailyPlan = [];
  } else {
    parsed.dailyPlan = parsed.dailyPlan.map((step: any, sIdx: number) => ({
      step: Number(step.step) || sIdx + 1,
      title: String(step.title || `Action Tier ${sIdx + 1}`).trim(),
      description: String(step.description || 'Proceed with operational task.').trim(),
      assignee: String(step.assignee || 'Not specified').trim(),
    }));
  }

  // Validate follow up email
  if (!parsed.followUpEmail || typeof parsed.followUpEmail !== 'object') {
    parsed.followUpEmail = {
      subject: 'Operations Follow-Up: Action Items & Priorities',
      body: 'Please review the extracted action items and next steps.',
    };
  } else {
    parsed.followUpEmail = {
      subject: String(parsed.followUpEmail.subject || 'Operations Follow-Up: Action Items & Priorities').trim(),
      body: String(parsed.followUpEmail.body || 'Please review the extracted action items and next steps.').trim(),
    };
  }

  return {
    data: parsed,
    meta: {
      timestamp: new Date().toISOString(),
      charCount: text.length,
      taskCount: parsed.actionItems.length,
      blockerCount: parsed.blockers.length,
    },
  };
}
