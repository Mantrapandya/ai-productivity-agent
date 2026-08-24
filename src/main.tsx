import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against unhandled rejections from development environment WebSocket disconnects
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = typeof reason === 'string' ? reason : reason?.message || '';
    if (msg.includes('WebSocket') || msg.includes('ws') || msg.includes('vite')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
