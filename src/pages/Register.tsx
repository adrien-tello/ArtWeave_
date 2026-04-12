import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Logo';

export function Register() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await registerUser(form.name, form.email, form.phone, form.password);
      toast.success('Account created!');
      navigate('/home');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center text-gray-500 hover:text-amber-600 mb-6 text-sm">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to login
        </Link>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Logo className="h-10 w-10" />
            <span className="text-2xl font-bold text-amber-600">ArtWeave</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">Create your account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', placeholder: 'Full name', type: 'text' },
              { key: 'email', placeholder: 'Email address', type: 'email' },
              { key: 'phone', placeholder: 'Phone (e.g. +237 6XX XXX XXX)', type: 'tel' },
              { key: 'password', placeholder: 'Password', type: 'password' },
              { key: 'confirm', placeholder: 'Confirm password', type: 'password' },
            ].map(f => (
              <input key={f.key} type={f.type} placeholder={f.placeholder} required={f.key !== 'phone'}
                value={form[f.key as keyof typeof form]} onChange={e => set(f.key, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none" />
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
