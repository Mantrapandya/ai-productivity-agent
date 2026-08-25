import { GoogleGenAI } from '@google/genai';

// Response Schema Definition for Gemini Structured Output
export const analysisResponseSchema = {
  type: 'OBJECT',
  properties: {
    executiveSummary: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Exactly 3 concise bullet points identifying the most critical operational updates.',
    },
    actionItems: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          task: { type: 'STRING', description: 'Clear actionable task description.' },
          assignee: { type: 'STRING', description: 'Explicit assignee name or exactly "Not specified".' },
          deadline: { type: 'STRING', description: 'Explicit deadline stated or exactly "No deadline".' },
          priority: { type: 'STRING', description: 'Must be "High", "Medium", or "Low" based strictly on stated urgency/deadlines.' },
          status: { type: 'STRING', description: 'Default "Not Started".' },
        },
        required: ['task', 'assignee', 'deadline', 'priority', 'status'],
      },
      description: 'List of all extracted operational action items.',
    },
    priorityInsights: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          item: { type: 'STRING', description: 'Priority item title.' },
          urgency: { type: 'STRING', description: 'Urgency indicator (e.g. Critical, High, Urgent, Moderate).' },
          rationale: { type: 'STRING', description: 'Clear rationale based strictly on source text.' },
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
          blocker: { type: 'STRING', description: 'Clear blocker/dependency description.' },
          impact: { type: 'STRING', description: 'Operational impact on timeline or deliverables.' },
          severity: { type: 'STRING', description: 'High, Medium, or Low.' },
        },
        required: ['blocker', 'impact', 'severity'],
      },
      description: 'Identified blockers, dependencies, waiting states, and resource constraints. Return empty array if none found.',
    },
    dailyPlan: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          step: { type: 'INTEGER', description: 'Step number (1, 2, 3, 4, etc.).' },
          title: { type: 'STRING', description: 'Ordered tier title: "Highest-priority action", "Next important action", "Follow-up action", or "Remaining actions".' },
          description: { type: 'STRING', description: 'Specific tactical action derived strictly from input.' },
          assignee: { type: 'STRING', description: 'Assigned individual or "Not specified".' },
        },
        required: ['step', 'title', 'description', 'assignee'],
      },
      description: 'Practical ordered 4-tier daily action plan based on user facts.',
    },
    followUpEmail: {
      type: 'OBJECT',
      properties: {
        subject: { type: 'STRING', description: 'Professional, concise subject line.' },
        body: { type: 'STRING', description: 'Complete follow-up email text containing Subject, Greeting, Key action items, Deadlines, Clear next steps, and Professional closing.' },
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
Your role is to transform unstructured operational information (meeting notes, shift reports, daily work logs, project standups) into high-fidelity, structured business intelligence with ZERO hallucination and strict grounding.

CRITICAL INSTRUCTIONS & STRICT OPERATIONAL GROUNDING RULES:
1. ONLY use information explicitly provided in the user's operational update.
2. NEVER invent tasks, people, deadlines, commitments, owners, or business facts.
3. If an assignee/owner is not mentioned in the text, use exactly "Not specified".
4. If a deadline is not mentioned in the text, use exactly "No deadline".
5. For EXECUTIVE SUMMARY: Provide EXACTLY 3 concise bullet points identifying the most important operational updates from the input.
6. For ACTION ITEMS: Extract all distinct tasks. Set initial status to "Not Started". Priority must strictly be "High", "Medium", or "Low" based on evidence (explicit urgency, close deadlines, dependencies, or operational impact).
7. For PRIORITY INSIGHTS: Highlight high-impact urgent items with clear rationale based strictly on evidence from the text.
8. For BLOCKERS & DEPENDENCIES: Identify waiting states (e.g., marketing waiting for design images), supply/resource shortages (e.g., warehouse running low on packaging), or critical bottlenecks. If no blockers or dependencies are present, return an empty array [].
9. For DAILY ACTION PLAN: Provide an ordered action plan prioritizing:
   - Tier 1: Explicit urgent items / immediate operations
   - Tier 2: Approaching deadlines / scheduled deliverables
   - Tier 3: Blocking dependencies / inter-team coordination
   - Tier 4: Remaining tasks / routine follow-ups
   Do not invent any new tasks outside the provided text.
10. For FOLLOW-UP EMAIL: Generate a complete, professional follow-up email containing:
    - Subject: Clear, professional subject line
    - Greeting (e.g., "Hi Team," or "Team,")
    - Key Action Items & Deadlines (using only extracted facts)
    - Next Steps & Dependencies
    - Professional Closing
    Do not invent names, deadlines, commitments, or responsibilities.`;

  const userPrompt = `Operational Update to Process:\n"""\n${text.trim()}\n"""${focusNote ? `\n\nAdditional Focus / Context Note: ${focusNote}` : ''}\n\nExecute the full operations intelligence extraction into the specified JSON format.`;

  // Candidate model hierarchy with automatic retries on transient 503 / 429 errors
  const candidateModels = [
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-2.5-flash',
    'gemini-3.1-pro-preview',
    'gemini-2.5-pro',
    'gemini-flash-latest',
  ];

  let response: any = null;
  let lastError: any = null;

  for (const model of candidateModels) {
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        response = await aiClient.models.generateContent({
          model,
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.1,
            responseMimeType: 'application/json',
            responseSchema: analysisResponseSchema as any,
            thinkingConfig: {
              thinkingBudget: 0,
            },
          },
        });
        if (response?.text) {
          break; // Successfully generated
        }
      } catch (err: any) {
        lastError = err;
        const status = err?.status || err?.code || '';
        const message = String(err?.message || '');

        // If thinkingConfig is not supported for a specific model version, retry without it
        if (message.includes('thinkingConfig') || message.includes('thinking_config')) {
          try {
            response = await aiClient.models.generateContent({
              model,
              contents: userPrompt,
              config: {
                systemInstruction,
                temperature: 0.1,
                responseMimeType: 'application/json',
                responseSchema: analysisResponseSchema as any,
              },
            });
            if (response?.text) {
              break;
            }
          } catch (retryErr: any) {
            lastError = retryErr;
          }
        }

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
          // Short backoff before retry
          await new Promise((resolve) => setTimeout(resolve, 500 * attempts));
          continue;
        }
        break; // Move to next candidate model
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
    // Attempt regex extraction of JSON object
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
