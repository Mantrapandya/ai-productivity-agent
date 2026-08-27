import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-indigo-400 shrink-0" />;
    }
  };

  const getBg = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-[#111624] border-emerald-500/30 text-emerald-200';
      case 'error':
        return 'bg-[#111624] border-rose-500/30 text-rose-200';
      case 'info':
      default:
        return 'bg-[#111624] border-indigo-500/30 text-indigo-200';
    }
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border shadow-xl text-xs font-medium transition-all ${getBg()}`}
    >
      <div className="flex items-center gap-2.5">
        {getIcon()}
        <span>{toast.message}</span>
      </div>
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

