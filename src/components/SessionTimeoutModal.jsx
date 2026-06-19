import { useState, useEffect } from 'react';
import { Clock, LogOut, RefreshCw } from 'lucide-react';

export default function SessionTimeoutModal({ onExtend, onLogout, warningAt = 300 }) {
  const [seconds, setSeconds] = useState(warningAt);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onLogout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onLogout]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = ((warningAt - seconds) / warningAt) * 100;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in-fast">
      <div className="glass-card rounded-2xl p-8 w-full max-w-sm mx-4 text-center border border-warning-500/30"
           style={{ boxShadow: '0 0 60px rgba(245,158,11,0.15), 0 25px 50px rgba(0,0,0,0.6)' }}>
        
        {/* Icon */}
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-warning-500/15 border border-warning-500/30 mb-5 mx-auto">
          <Clock className="h-8 w-8 text-warning-400 animate-pulse" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-2">Session Expiring Soon</h2>
        <p className="text-sm text-dark-400 mb-6">
          Your session will expire due to inactivity. You will be automatically logged out in:
        </p>

        {/* Countdown */}
        <div className="text-5xl font-bold text-warning-400 mb-2 font-mono">
          {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
        
        {/* Progress bar */}
        <div className="h-1.5 w-full bg-dark-700 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-warning-500 to-danger-500 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-dark-600 text-dark-300 text-sm font-medium hover:bg-dark-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout Now
          </button>
          <button
            onClick={onExtend}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white text-sm font-bold hover:from-primary-600 hover:to-cyan-600 transition-all shadow-lg shadow-primary-500/25"
          >
            <RefreshCw className="h-4 w-4" />
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}
