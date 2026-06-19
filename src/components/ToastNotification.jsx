import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const toastIcons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const toastStyles = {
  success: {
    border: 'border-success-500/40',
    icon: 'text-success-400',
    bg: 'bg-dark-900',
    progress: 'bg-success-500',
    glow: '0 0 20px rgba(34,197,94,0.15)',
  },
  warning: {
    border: 'border-warning-500/40',
    icon: 'text-warning-400',
    bg: 'bg-dark-900',
    progress: 'bg-warning-500',
    glow: '0 0 20px rgba(245,158,11,0.15)',
  },
  error: {
    border: 'border-danger-500/40',
    icon: 'text-danger-400',
    bg: 'bg-dark-900',
    progress: 'bg-danger-500',
    glow: '0 0 20px rgba(239,68,68,0.15)',
  },
  info: {
    border: 'border-primary-500/40',
    icon: 'text-primary-400',
    bg: 'bg-dark-900',
    progress: 'bg-primary-500',
    glow: '0 0 20px rgba(59,130,246,0.15)',
  },
};

function ToastItem({ id, type = 'info', title, message, duration = 4000, onDismiss }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const style = toastStyles[type] || toastStyles.info;
  const Icon = toastIcons[type] || Info;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev - (100 / (duration / 100));
        if (next <= 0) {
          clearInterval(interval);
          setVisible(false);
          setTimeout(() => onDismiss(id), 300);
        }
        return Math.max(0, next);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [id, duration, onDismiss]);

  return (
    <div
      className={`relative w-80 rounded-xl border ${style.border} ${style.bg} shadow-2xl overflow-hidden transition-all duration-300 ${
        visible ? 'animate-toast-in opacity-100' : 'opacity-0 translate-x-full'
      }`}
      style={{ boxShadow: `${style.glow}, 0 25px 50px rgba(0,0,0,0.5)` }}
    >
      <div className="flex items-start gap-3 p-4">
        <div className={`mt-0.5 shrink-0 ${style.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          {title && <p className="text-sm font-semibold text-white">{title}</p>}
          {message && <p className="text-xs text-dark-400 mt-0.5">{message}</p>}
        </div>
        <button
          onClick={() => { setVisible(false); setTimeout(() => onDismiss(id), 300); }}
          className="shrink-0 p-0.5 rounded-lg hover:bg-white/10 transition-colors text-dark-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 h-0.5 bg-dark-700 w-full">
        <div
          className={`h-full ${style.progress} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

let toastId = 0;
let globalAddToast = null;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((opts) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, ...opts }]);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    globalAddToast = addToast;
    return () => { globalAddToast = null; };
  }, [addToast]);

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem {...t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </>
  );
}

export function toast(opts) {
  if (globalAddToast) globalAddToast(opts);
}

export function useToast() {
  return {
    success: (title, message) => toast({ type: 'success', title, message }),
    warning: (title, message) => toast({ type: 'warning', title, message }),
    error: (title, message) => toast({ type: 'error', title, message }),
    info: (title, message) => toast({ type: 'info', title, message }),
  };
}

export default ToastProvider;
