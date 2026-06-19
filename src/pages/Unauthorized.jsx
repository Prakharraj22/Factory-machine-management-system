import { ShieldOff, ArrowLeft, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4">
      <div className="absolute inset-0 grid-pattern-dense opacity-30" />
      <div className="relative text-center max-w-sm mx-auto">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-danger-500/15 border border-danger-500/30 mb-6 mx-auto">
          <ShieldOff className="h-10 w-10 text-danger-400" />
        </div>
        <div className="inline-flex items-center gap-2 mb-4">
          <Cpu className="h-5 w-5 text-primary-400" />
          <span className="text-sm font-black text-white">Factory<span className="gradient-text-cyan">IQ</span></span>
        </div>
        <h1 className="text-2xl font-black text-white mb-1">Access Denied</h1>
        <p className="text-danger-400 text-sm font-semibold mb-3">403 — Unauthorized</p>
        <p className="text-dark-400 text-sm mb-8">
          You don't have the required permissions to access this resource. Contact your system administrator.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 mx-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-dark-700 to-dark-600 hover:from-dark-600 hover:to-dark-500 transition-all border border-dark-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    </div>
  );
}
