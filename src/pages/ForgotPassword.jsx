import { Mail, ArrowLeft, CheckCircle, Cpu, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4">
      <div className="absolute inset-0 grid-pattern-dense opacity-40" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary-600/6 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-cyan-600/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 shadow-xl shadow-primary-500/30 mb-4">
            <Cpu className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-black text-white">Factory<span className="gradient-text-cyan">IQ</span></h1>
          <p className="text-xs text-dark-500 mt-1">Enterprise Platform</p>
        </div>

        <div className="glass-card rounded-2xl p-8" style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.5)' }}>
          {!sent ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-black text-white">Reset Password</h2>
                <p className="text-sm text-dark-400 mt-1">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-dark-300 uppercase tracking-wider mb-2">
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
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary-500 to-cyan-600 hover:from-primary-600 hover:to-cyan-700 disabled:opacity-60 transition-all duration-300 shadow-lg shadow-primary-500/25"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-success-500/15 border border-success-500/30 mb-4">
                <CheckCircle className="h-8 w-8 text-success-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Check your email</h3>
              <p className="text-sm text-dark-400 mb-6">
                We've sent a password reset link to <strong className="text-white">{email}</strong>
              </p>
              <p className="text-xs text-dark-500">
                Didn't receive it? Check spam or{' '}
                <button onClick={() => setSent(false)} className="text-primary-400 hover:text-primary-300 font-semibold">
                  try again
                </button>
              </p>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-white/8 flex justify-center">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
