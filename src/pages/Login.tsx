import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Logo';

type Tab = 'user' | 'seller';

export function Login({ defaultTab = 'user' }: { defaultTab?: Tab }) {
  const navigate = useNavigate();
  const { loginUser, loginSeller } = useAuth();
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === 'user') {
        await loginUser(form.email, form.password);
        toast.success('Welcome back!');
        navigate('/home');
      } else {
        await loginSeller(form.email, form.password);
        toast.success('Welcome back!');
        navigate('/seller/dashboard');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-amber-600 mb-6 text-sm">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Logo className="h-10 w-10" />
            <span className="text-2xl font-bold text-amber-600">ArtWeave</span>
          </div>

          {/* Tabs — user and seller only */}
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1 mb-6">
            {(['user', 'seller'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all capitalize ${tab === t ? 'bg-white dark:bg-gray-600 shadow text-amber-600' : 'text-gray-500 dark:text-gray-400'}`}>
                {t === 'user' ? 'Buyer' : 'Seller'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="Email address"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
            />

            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none pr-12"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {tab === 'user' && (
            <p className="text-center text-sm text-gray-500 mt-4">
              No account?{' '}
              <Link to="/register" className="text-amber-600 font-medium hover:underline">Register</Link>
            </p>
          )}
          {tab === 'seller' && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Not a seller yet?{' '}
              <Link to="/seller/register" className="text-amber-600 font-medium hover:underline">Register your shop</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
