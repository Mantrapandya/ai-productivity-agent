import { executeOperationsAnalysis } from '../src/server/geminiService';

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
