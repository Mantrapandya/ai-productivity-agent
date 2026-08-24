import React from 'react';
import { History, Trash2, ArrowRight, CheckSquare, X } from 'lucide-react';
import { AnalysisHistoryItem } from '../types';

interface HistoryModalProps {
  history: AnalysisHistoryItem[];
  onSelect: (item: AnalysisHistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  history,
  onSelect,
  onDelete,
  onClearAll,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-[#0D1322] w-full max-w-2xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Operations Analysis History
              </h3>
              <p className="text-xs text-slate-400">
                Locally saved operational snapshots from your session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2.5 py-1 rounded-md transition-colors font-medium border border-rose-500/20"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="p-4 sm:p-6 overflow-y-auto divide-y divide-slate-800/60 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No saved history yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Any operational updates you analyze will automatically be stored here for quick recall.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex items-start justify-between gap-4 group hover:bg-slate-800/40 px-3 rounded-xl transition-colors"
              >
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-slate-200 truncate max-w-md">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.summaryPreview || item.inputText}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-medium font-mono">
                    <span className="flex items-center gap-1 text-indigo-400">
                      <CheckSquare className="w-3 h-3" />
                      <span>{item.result.actionItems.length} action items</span>
                    </span>
                    <span>•</span>
                    <span className="text-rose-400">{item.result.blockers.length} blockers</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pt-1">
                  <button
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-md transition-colors border border-transparent hover:border-indigo-500/20"
                    title="Load analysis"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
