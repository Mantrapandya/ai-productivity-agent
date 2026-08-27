import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ProcessingState } from './components/ProcessingState';
import { ExecutiveSummaryCard } from './components/ExecutiveSummaryCard';
import { ActionItemsTable } from './components/ActionItemsTable';
import { PriorityInsightsCard } from './components/PriorityInsightsCard';
import { BlockersCard } from './components/BlockersCard';
import { DailyPlanCard } from './components/DailyPlanCard';
import { FollowUpEmailCard } from './components/FollowUpEmailCard';
import { QuickActionsBar } from './components/QuickActionsBar';
import { HistoryModal } from './components/HistoryModal';
import { AboutWorkflow } from './components/AboutWorkflow';
import { ToastContainer, ToastMessage } from './components/Toast';
import { SAMPLE_SCENARIOS } from './data/sampleData';
import { OpsAnalysisResult, AnalysisHistoryItem } from './types';
import { copyToClipboard } from './utils/exportUtils';

const STORAGE_KEY = 'opsflow_analyses_history_v1';

export default function App() {
  const [inputText, setInputText] = useState<string>(SAMPLE_SCENARIOS[0].text);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<OpsAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'about'>('dashboard');
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage', e);
    }
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedLabel(label);
      addToast(`Copied ${label} to clipboard!`, 'success');
      setTimeout(() => setCopiedLabel(null), 2500);
    } else {
      addToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleAnalyze = async (focusNote?: string, customText?: string) => {
    const rawText = customText !== undefined ? customText : inputText;
    const textToProcess = rawText.trim();
    
    if (!textToProcess) {
      setErrorMessage('Please enter or paste an operational update before analyzing.');
      addToast('Please enter an operational update before analyzing.', 'info');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze-operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToProcess, focusNote }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResp = await response.text();
        console.warn('Server returned non-JSON response:', textResp);
        if (response.status === 502 || response.status === 503 || response.status === 504) {
          throw new Error('Backend server is temporarily busy or reconnecting. Please retry in a few seconds.');
        }
        throw new Error(`Server returned unexpected response (${response.status}). Please try again.`);
      }

      if (!response.ok || !data || !data.success) {
        throw new Error(data?.error || 'Failed to analyze operational update. Please try again.');
      }

      setAnalysisResult(data.data);
      addToast('Operational intelligence generated successfully!', 'success');

      // Save to history
      const newHistoryItem: AnalysisHistoryItem = {
        id: `history-${Date.now()}`,
        title: textToProcess.split('\n')[0].slice(0, 45) || 'Operational Update',
        inputText: textToProcess,
        result: data.data,
        timestamp: new Date().toISOString(),
        summaryPreview: data.data.executiveSummary?.[0] || '',
      };

      const updatedHistory = [newHistoryItem, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (err: any) {
      console.error('Analysis error:', err);
      const msg = err.message || 'An unexpected error occurred while processing. Please retry.';
      setErrorMessage(msg);
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (item: AnalysisHistoryItem) => {
    setInputText(item.inputText);
    setAnalysisResult(item.result);
    setErrorMessage(null);
    setActiveTab('dashboard');
    addToast('Restored saved operational analysis', 'info');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    addToast('Record deleted from history', 'info');
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    addToast('History cleared', 'info');
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearInput = () => {
    setInputText('');
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="relative min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'history') {
            setIsHistoryOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onNewAnalysis={handleNewAnalysis}
        hasResults={!!analysisResult}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'about' ? (
          <AboutWorkflow />
        ) : (
          <div className="space-y-6">
            {/* Title & Subtitle Banner */}
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Track 3 Operations Intelligence Agent</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                OpsFlow AI — Daily Operations Assistant
              </h1>
              <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-3xl">
                Turn unstructured updates, notes, and shift logs into actionable business intelligence.
              </p>
            </div>

            {/* Error Banner if any */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3 text-xs text-rose-200 shadow-xl">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block mb-0.5">Analysis Pipeline Notice</span>
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={() => handleAnalyze()}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold transition-colors shrink-0 shadow-xs"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Top / Left Section: Input Panel */}
            <InputPanel
              inputText={inputText}
              onChangeText={setInputText}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              onClear={handleClearInput}
            />

            {/* Loading Indicator */}
            {isLoading && <ProcessingState />}

            {/* Right / Below Section: AI Generated Results */}
            {!isLoading && analysisResult && (
              <div className="space-y-6 animate-fadeIn">
                {/* Executive Summary (1) & Priority Insights (3) in Responsive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ExecutiveSummaryCard
                    summary={analysisResult.executiveSummary}
                    onCopy={handleCopy}
                    copiedLabel={copiedLabel}
                  />

                  <PriorityInsightsCard
                    insights={analysisResult.priorityInsights}
                    onCopy={handleCopy}
                    copiedLabel={copiedLabel}
                  />
                </div>

                {/* Action Items Matrix (2) */}
                <ActionItemsTable
                  items={analysisResult.actionItems}
                  onUpdateItems={(updated) =>
                    setAnalysisResult({ ...analysisResult, actionItems: updated })
                  }
                  onCopy={handleCopy}
                  copiedLabel={copiedLabel}
                />

                {/* Blockers & Dependencies (4) & Daily Action Plan (5) in Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BlockersCard
                    blockers={analysisResult.blockers}
                    onCopy={handleCopy}
                    copiedLabel={copiedLabel}
                  />

                  <DailyPlanCard
                    plan={analysisResult.dailyPlan}
                    onCopy={handleCopy}
                    copiedLabel={copiedLabel}
                  />
                </div>

                {/* Follow-Up Email (6) */}
                <FollowUpEmailCard
                  email={analysisResult.followUpEmail}
                  onCopy={handleCopy}
                  copiedLabel={copiedLabel}
                />

                {/* Quick Actions Bar (7) */}
                <QuickActionsBar
                  result={analysisResult}
                  rawInput={inputText}
                  onCopy={handleCopy}
                  onNewAnalysis={handleNewAnalysis}
                  copiedLabel={copiedLabel}
                />
              </div>
            )}

            {/* Empty State before analysis */}
            {!isLoading && !analysisResult && (
              <div className="bg-[#111624] border border-[#1E2638] rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Ready to Synthesize Operational Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed max-w-md mx-auto">
                  Paste meeting notes, shift reports, or project updates to turn them into structured action items and follow-ups.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => handleAnalyze()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Run Ingestion</span>
                  </button>
                  <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#13192B] hover:bg-[#1C2438] text-slate-300 text-xs font-semibold rounded-xl border border-[#1E2638] transition-colors"
                  >
                    <span>View Snapshots</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1E2638] bg-[#0B0F17] py-4 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-slate-200">OpsFlow AI</span>
            <span>—</span>
            <span>Google Cloud Gen AI Academy APAC Edition 2026</span>
          </div>
        </div>
      </footer>

      {/* History Modal Drawer */}
      {isHistoryOpen && (
        <HistoryModal
          history={history}
          onSelect={handleSelectHistoryItem}
          onDelete={handleDeleteHistoryItem}
          onClearAll={handleClearAllHistory}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
