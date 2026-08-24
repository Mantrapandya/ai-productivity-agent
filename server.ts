import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { executeOperationsAnalysis } from './src/server/geminiService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Route: Analyze Operations
app.post('/api/analyze-operations', async (req, res) => {
  try {
    const { text, focusNote } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please enter an operational update before analyzing.',
      });
    }

    const result = await executeOperationsAnalysis(text, focusNote);

    return res.json({
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
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'OpsFlow AI Backend', model: 'gemini-3.7-flash' });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OpsFlow AI] Server active on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer();
