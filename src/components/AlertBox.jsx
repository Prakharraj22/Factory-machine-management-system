import { AlertCircle, AlertTriangle, Info, Zap, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const severityConfig = {
  critical: {
    icon: Zap,
    bg: 'bg-danger-500/8 dark:bg-danger-500/10',
    border: 'border-l-danger-500 border-danger-500/20',
    title: 'text-danger-600 dark:text-danger-400',
    iconColor: 'text-danger-500',
    badge: 'bg-danger-500',
    dot: 'bg-danger-500 animate-pulse shadow-lg shadow-danger-500/50',
    label: 'CRITICAL',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-warning-500/8 dark:bg-warning-500/10',
    border: 'border-l-warning-500 border-warning-500/20',
    title: 'text-warning-600 dark:text-warning-400',
    iconColor: 'text-warning-500',
    badge: 'bg-warning-500',
    dot: 'bg-warning-500 shadow-lg shadow-warning-500/50',
    label: 'WARNING',
  },
  info: {
    icon: Info,
    bg: 'bg-primary-500/8 dark:bg-primary-500/10',
    border: 'border-l-primary-500 border-primary-500/20',
    title: 'text-primary-600 dark:text-primary-400',
    iconColor: 'text-primary-500',
    badge: 'bg-primary-500',
    dot: 'bg-primary-500',
    label: 'INFO',
  },
  success: {
    icon: AlertCircle,
    bg: 'bg-success-500/8 dark:bg-success-500/10',
    border: 'border-l-success-500 border-success-500/20',
    title: 'text-success-600 dark:text-success-400',
    iconColor: 'text-success-500',
    badge: 'bg-success-500',
    dot: 'bg-success-500',
    label: 'RESOLVED',
  },
};

export default function AlertBox({ type = 'info', title, message, details, timestamp, onDismiss, onAcknowledge }) {
  const [expanded, setExpanded] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const config = severityConfig[type] || severityConfig.info;
  const Icon = config.icon;

  const handleAcknowledge = () => {
    setAcknowledged(true);
    onAcknowledge?.();
  };

  return (
    <div className={`rounded-xl border-l-4 border ${config.border} ${config.bg} overflow-hidden transition-all duration-300 ${acknowledged ? 'opacity-60' : ''}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Severity dot + icon */}
          <div className="shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
            <div className={`h-2 w-2 rounded-full ${config.dot}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 shrink-0 ${config.iconColor}`} />
                <span className={`text-xs font-bold uppercase tracking-wide ${config.title}`}>{config.label}</span>
                {acknowledged && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-dark-200 dark:bg-dark-700 text-dark-500 dark:text-dark-400 uppercase">ACK</span>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {details && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="p-1 rounded hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors text-dark-400"
                  >
                    {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                )}
                {onDismiss && (
                  <button
                    onClick={onDismiss}
                    className="p-1 rounded hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors text-dark-400"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <h4 className="text-sm font-semibold text-dark-800 dark:text-white mt-1">{title}</h4>
            <p className="text-xs text-dark-600 dark:text-dark-300 mt-0.5">{message}</p>

            {expanded && details && (
              <div className="mt-2 p-3 rounded-lg bg-dark-100 dark:bg-dark-900/50 border border-dark-200 dark:border-dark-700/50">
                <p className="text-xs text-dark-600 dark:text-dark-400">{details}</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              {timestamp && <span className="text-[10px] text-dark-400">{timestamp}</span>}
              {!acknowledged && (
                <button
                  onClick={handleAcknowledge}
                  className="ml-auto text-[10px] font-semibold text-primary-500 hover:text-primary-400 transition-colors uppercase tracking-wide"
                >
                  Acknowledge
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
