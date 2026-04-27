import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Lock, User, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

export function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin, role, hydrated } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [form, setForm] = useState({ username: '', password: '' });

  // Redirect if already logged in as admin
  useEffect(() => {
    if (hydrated && role === 'admin') navigate('/admin', { replace: true });
  }, [hydrated, role, navigate]);

  // Countdown timer when locked out
  useEffect(() => {
    if (!locked) return;
    const interval = setInterval(() => {
      setLockTimer(t => {
        if (t <= 1) { setLocked(false); setAttempts(0); clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [locked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;

    setLoading(true);
    try {
      await loginAdmin(form.username, form.password);
      toast.success('Access granted');
      navigate('/admin', { replace: true });
    } catch {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Lock after 5 failed attempts for 60 seconds
      if (newAttempts >= 5) {
        setLocked(true);
        setLockTimer(60);
        toast.error('Too many failed attempts. Locked for 60 seconds.');
      } else {
        toast.error(`Invalid credentials. ${5 - newAttempts} attempt${5 - newAttempts !== 1 ? 's' : ''} remaining.`);
      }
      setForm(f => ({ ...f, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-950 to-gray-950" />

      <div className="relative w-full max-w-md">
        {/* Header badge */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2 bg-gray-800 border border-gray-700 rounded-full px-4 py-2">
            <Shield className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">
              Restricted Access
            </span>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Logo area */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl mb-4">
              <Lock className="h-8 w-8 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-gray-500 text-sm mt-1">ArtWeave Platform Management</p>
          </div>

          {/* Lockout warning */}
          {locked && (
            <div className="flex items-center space-x-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-400 text-sm font-medium">Account temporarily locked</p>
                <p className="text-red-500/70 text-xs mt-0.5">Try again in {lockTimer} seconds</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="Enter admin username"
                  required
                  disabled={locked}
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter admin password"
                  required
                  disabled={locked}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Attempts indicator */}
            {attempts > 0 && !locked && (
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i < attempts ? 'bg-red-500' : 'bg-gray-700'}`} />
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || locked}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:text-gray-500 text-gray-900 font-bold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>{locked ? `Locked (${lockTimer}s)` : 'Access Admin Panel'}</span>
                </>
              )}
            </button>
          </form>

          {/* Security notice */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-center text-xs text-gray-600">
              This area is restricted to authorized personnel only.
              <br />Unauthorized access attempts are logged.
            </p>
          </div>
        </div>

        {/* Back link — subtle, not prominent */}
        <p className="text-center mt-6">
          <a href="/" className="text-xs text-gray-700 hover:text-gray-500 transition-colors">
            ← Return to store
          </a>
        </p>
      </div>
    </div>
  );
}
