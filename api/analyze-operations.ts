import { GoogleGenAI, Type } from '@google/genai';

// Response Schema Definition for Gemini Structured Output
const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Exactly 3 concise bullet points identifying the most critical operational updates.',
    },
    actionItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          task: { type: Type.STRING, description: 'Clear actionable task description.' },
          assignee: { type: Type.STRING, description: 'Explicit assignee name or exactly "Not specified".' },
          deadline: { type: Type.STRING, description: 'Explicit deadline stated or exactly "No deadline".' },
          priority: { type: Type.STRING, description: 'Must be "High", "Medium", or "Low" based strictly on stated urgency/deadlines.' },
          status: { type: Type.STRING, description: 'Default "Not Started".' },
        },
        required: ['task', 'assignee', 'deadline', 'priority', 'status'],
      },
      description: 'List of all extracted operational action items.',
    },
    priorityInsights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING, description: 'Priority item title.' },
          urgency: { type: Type.STRING, description: 'Urgency indicator (e.g. Critical, High, Urgent, Moderate).' },
          rationale: { type: Type.STRING, description: 'Clear rationale based strictly on source text.' },
        },
        required: ['item', 'urgency', 'rationale'],
      },
      description: 'Strategic priority insights with grounded reasoning.',
    },
    blockers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          blocker: { type: Type.STRING, description: 'Clear blocker/dependency description.' },
          impact: { type: Type.STRING, description: 'Operational impact on timeline or deliverables.' },
          severity: { type: Type.STRING, description: 'High, Medium, or Low.' },
        },
        required: ['blocker', 'impact', 'severity'],
      },
      description: 'Identified blockers, dependencies, waiting states, and resource constraints. Return empty array if none found.',
    },
    dailyPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.INTEGER, description: 'Step number (1, 2, 3, 4, etc.).' },
          title: { type: Type.STRING, description: 'Ordered tier title: "Highest-priority action", "Next important action", "Follow-up action", or "Remaining actions".' },
          description: { type: Type.STRING, description: 'Specific tactical action derived strictly from input.' },
          assignee: { type: Type.STRING, description: 'Assigned individual or "Not specified".' },
        },
        required: ['step', 'title', 'description', 'assignee'],
      },
      description: 'Practical ordered 4-tier daily action plan based on user facts.',
    },
    followUpEmail: {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING, description: 'Professional, concise subject line.' },
        body: { type: Type.STRING, description: 'Complete follow-up email text containing Subject, Greeting, Key action items, Deadlines, Clear next steps, and Professional closing.' },
      },
      required: ['subject', 'body'],
      description: 'Professional follow-up email communication.',
    },
  },
  required: ['executiveSummary', 'actionItems', 'priorityInsights', 'blockers', 'dailyPlan', 'followUpEmail'],
};

async function executeOperationsAnalysis(text: string, focusNote?: string) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('Please enter an operational update before analyzing.');
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please ensure GEMINI_API_KEY is available in the environment.');
  }

  const aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

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
            responseSchema: analysisResponseSchema,
          },
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
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
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

export default async function handler(req: any, res: any) {
  // Support CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { text, focusNote } = body || {};

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please enter an operational update before analyzing.',
      });
    }

    const result = await executeOperationsAnalysis(text, focusNote);

    return res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error: any) {
    console.error('OpsFlow AI Analysis Error:', error?.message || 'Unknown error');
    
    // Defensive sanitization: ensure no API keys, internal paths, or stack traces leak to the client
    let safeErrorMessage = 'An unexpected error occurred while analyzing the operational update. Please retry.';
    if (error?.message && typeof error.message === 'string') {
      const rawMsg = error.message;
      const containsSensitiveData =
        rawMsg.includes('AIza') ||
        rawMsg.includes('key') ||
        rawMsg.includes('auth') ||
        rawMsg.includes('credential') ||
        rawMsg.includes('/node_modules') ||
        rawMsg.includes('at ') ||
        rawMsg.includes('http');

      if (!containsSensitiveData) {
        safeErrorMessage = rawMsg;
      }
    }

    return res.status(500).json({
      success: false,
      error: safeErrorMessage,
    });
  }
}
