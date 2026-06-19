import { Clock, LogIn, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SessionExpired() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4">
      <div className="absolute inset-0 grid-pattern-dense opacity-30" />
      <div className="relative text-center max-w-sm mx-auto">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-warning-500/15 border border-warning-500/30 mb-6 mx-auto">
          <Clock className="h-10 w-10 text-warning-400" />
        </div>
        <div className="inline-flex items-center gap-2 mb-4">
          <Cpu className="h-5 w-5 text-primary-400" />
          <span className="text-sm font-black text-white">Factory<span className="gradient-text-cyan">IQ</span></span>
        </div>
        <h1 className="text-2xl font-black text-white mb-3">Session Expired</h1>
        <p className="text-dark-400 text-sm mb-8">
          Your session has expired due to inactivity. Please sign in again to continue.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="flex items-center justify-center gap-2 mx-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary-500 to-cyan-600 hover:from-primary-600 hover:to-cyan-700 transition-all shadow-lg shadow-primary-500/25"
        >
          <LogIn className="h-4 w-4" />
          Sign In Again
        </button>
      </div>
    </div>
  );
}
