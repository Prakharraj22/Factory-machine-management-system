import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail, Lock, Eye, EyeOff, Shield, AlertCircle,
  ArrowRight, Factory, Cpu, Activity, BarChart3,
  BrainCircuit, CheckCircle, Loader2,
} from 'lucide-react';

const DEMO_CREDS = [
  { email: 'admin@factory.com', password: 'admin123', role: 'Admin', color: 'from-violet-500 to-primary-500' },
  { email: 'engineer@factory.com', password: 'eng123', role: 'Engineer', color: 'from-primary-500 to-cyan-500' },
  { email: 'viewer@factory.com', password: 'view123', role: 'Viewer', color: 'from-success-500 to-cyan-600' },
];

const TICKER_ITEMS = [
  '🟢 M103 Conveyor Line — Healthy  •  ',
  '🔴 M102 Hydraulic Press — CRITICAL Alert  •  ',
  '⚠️ M107 Laser Cutter — Maintenance Due  •  ',
  '🟢 M114 Quality Scanner — 100% Uptime  •  ',
  '🔶 M110 Stamping Press — Temperature Threshold  •  ',
  '✅ Predictive Model v2.4 — 94.7% Accuracy  •  ',
  '📊 20 Machines Monitored — Real-time  •  ',
];

const FEATURES = [
  { icon: Activity, label: 'Real-time Monitoring', desc: '20+ machines, live sensor data' },
  { icon: BrainCircuit, label: 'AI Failure Prediction', desc: 'ML-powered with 94.7% accuracy' },
  { icon: BarChart3, label: 'Executive Analytics', desc: 'OEE, MTBF, MTTR dashboards' },
  { icon: Shield, label: 'Enterprise Security', desc: 'JWT, RBAC, SOC 2 Type II' },
];

function GearSVG({ size = 80, speed = 12, reverse = false, className = '' }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 80 80"
      className={`${reverse ? 'animate-spin-reverse' : 'animate-spin-slow'} ${className}`}
      style={{ opacity: 0.12 }}
    >
      <path
        d="M40 10 L45 5 L50 10 L55 8 L57 14 L63 14 L63 20 L68 22 L66 28 L70 33 L65 36 L65 44 L70 47 L66 52 L68 58 L62 60 L62 66 L56 66 L55 72 L49 70 L44 75 L40 70 L36 75 L31 70 L25 72 L24 66 L18 66 L18 60 L12 58 L14 52 L10 47 L15 44 L15 36 L10 33 L14 28 L12 22 L17 20 L17 14 L23 14 L25 8 L30 10 L35 5 Z"
        fill="currentColor"
        className="text-primary-400"
      />
      <circle cx="40" cy="40" r="12" fill="currentColor" className="text-dark-900" />
      <circle cx="40" cy="40" r="8" fill="currentColor" className="text-primary-400" />
    </svg>
  );
}

function HexGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hex" x="0" y="0" width="56" height="97" patternUnits="userSpaceOnUse">
          <polygon points="28,2 54,16 54,48 28,62 2,48 2,16" fill="none" stroke="#60a5fa" strokeWidth="1" />
          <polygon points="0,50 28,64 56,50 56,97 28,111 0,97" fill="none" stroke="#60a5fa" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)" />
    </svg>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@factory.com');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('Admin');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  // Ticker animation
  const tickerText = TICKER_ITEMS.join('') + TICKER_ITEMS.join('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, role);
      setSuccess(true);
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-dark-950">

      {/* ══ LEFT PANEL (60%) ═════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[60%] relative flex-col justify-between p-12 overflow-hidden">

        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850" />
        <div className="absolute inset-0 grid-pattern-dense" />
        <HexGrid />

        {/* Radial glow spots */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-600/8 rounded-full blur-3xl pointer-events-none" />

        {/* Gear decorations */}
        <div className="absolute top-16 right-16">
          <GearSVG size={120} speed={20} />
        </div>
        <div className="absolute bottom-24 left-20">
          <GearSVG size={90} speed={15} reverse />
        </div>
        <div className="absolute top-1/2 right-32 -translate-y-1/2">
          <GearSVG size={60} speed={25} />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tight">
                Factory<span className="gradient-text-cyan">IQ</span>
              </span>
              <p className="text-[10px] text-dark-400 -mt-0.5">Enterprise Platform</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          {/* Headline */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse" />
              <span className="text-xs font-semibold text-primary-400">Industrial IoT Platform</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
              Predict Failures<br />
              <span className="gradient-text-cyan">Before They</span><br />
              Happen.
            </h1>
            <p className="text-dark-400 text-base leading-relaxed max-w-md">
              Enterprise-grade predictive maintenance powered by real-time machine learning.
              Reduce downtime by <strong className="text-white">73%</strong> and maintenance costs by <strong className="text-white">45%</strong>.
            </p>
          </div>

          {/* Feature pills */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 p-4 rounded-xl bg-white/3 border border-white/6 backdrop-blur-sm">
                <div className="shrink-0 p-2 rounded-lg bg-primary-500/15 border border-primary-500/20">
                  <Icon className="h-4 w-4 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-[11px] text-dark-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-4 flex-wrap">
            {['ISO 27001', 'SOC 2 Type II', '256-bit SSL', 'GDPR Ready'].map((badge) => (
              <div key={badge} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/4 border border-white/8">
                <CheckCircle className="h-3 w-3 text-success-400" />
                <span className="text-[11px] font-semibold text-dark-400">{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ticker tape */}
        <div className="relative z-10">
          <div className="ticker-container border-t border-white/6 pt-4">
            <div className="ticker-track text-[11px] text-dark-500 font-medium">
              {tickerText}
            </div>
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL (40%) ════════════════════════════════════════ */}
      <div className="flex-1 lg:w-[40%] flex items-center justify-center p-6 lg:p-10 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 to-dark-950 lg:from-dark-900 lg:to-dark-900" />

        <div className={`relative w-full max-w-md ${shake ? 'animate-shake' : ''}`}>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black text-white">Factory<span className="gradient-text-cyan">IQ</span></span>
          </div>

          {/* Card */}
          <div className="glass-card rounded-2xl p-8" style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)' }}>

            {/* Header */}
            <div className="mb-7">
              <h2 className="text-2xl font-black text-white mb-1">Welcome back</h2>
              <p className="text-sm text-dark-400">Sign in to your enterprise account</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-danger-500/10 border border-danger-500/25 animate-fade-in">
                <AlertCircle className="h-4 w-4 text-danger-400 shrink-0 mt-0.5" />
                <p className="text-sm text-danger-400">{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-5 flex items-center gap-3 p-4 rounded-xl bg-success-500/10 border border-success-500/25 animate-fade-in">
                <CheckCircle className="h-4 w-4 text-success-400 shrink-0" />
                <p className="text-sm text-success-400">Authentication successful! Redirecting...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-dark-300 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="enterprise-input pl-11"
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-dark-300 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-xs text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="enterprise-input pl-11 pr-12"
                    placeholder="••••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-dark-300 uppercase tracking-wider mb-2">
                  <Shield className="h-3.5 w-3.5" /> Access Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Admin', 'Engineer', 'Viewer'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-3 rounded-xl text-xs font-bold transition-all duration-200 border ${
                        role === r
                          ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30'
                          : 'bg-white/4 border-white/8 text-dark-400 hover:bg-white/8 hover:text-white hover:border-white/15'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setRemember(!remember)}
                  className={`h-5 w-5 rounded flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                    remember
                      ? 'bg-primary-500 border-primary-500'
                      : 'bg-white/5 border-white/15 group-hover:border-white/30'
                  }`}
                >
                  {remember && <CheckCircle className="h-3 w-3 text-white" />}
                </div>
                <span className="text-sm text-dark-400 group-hover:text-dark-300 transition-colors">
                  Remember me for 30 days
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary-500 via-primary-600 to-cyan-600 hover:from-primary-600 hover:via-primary-700 hover:to-cyan-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Authenticated!
                  </>
                ) : (
                  <>
                    Sign In to Platform
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 pt-5 border-t border-white/8">
              <p className="text-center text-[11px] font-bold text-dark-500 uppercase tracking-widest mb-3">
                Demo Access
              </p>
              <div className="space-y-2">
                {DEMO_CREDS.map((cred) => (
                  <button
                    key={cred.email}
                    type="button"
                    onClick={() => { setEmail(cred.email); setPassword(cred.password); setRole(cred.role); setError(''); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/4 hover:bg-white/8 border border-white/6 hover:border-white/12 transition-all text-left group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-dark-300 group-hover:text-white transition-colors">{cred.email}</p>
                      <p className="text-[10px] text-dark-500">Password: {cred.password}</p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${cred.color}`}>
                      {cred.role}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] text-dark-600 mt-6">
            © 2026 FactoryIQ Enterprise. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
