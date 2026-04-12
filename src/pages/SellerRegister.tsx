import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Logo';

export function SellerRegister() {
  const navigate = useNavigate();
  const { registerSeller } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', whatsapp: '',
    shop_name: '', shop_desc: '', password: '', confirm: '',
  });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await registerSeller({
        name: form.name, email: form.email, phone: form.phone,
        whatsapp: form.whatsapp || undefined,
        shop_name: form.shop_name, shop_desc: form.shop_desc || undefined,
        password: form.password,
      });
      toast.success('Shop registered! Awaiting admin approval.');
      navigate('/seller/dashboard');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Link to="/login" className="inline-flex items-center text-gray-500 hover:text-amber-600 mb-6 text-sm">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to login
        </Link>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Logo className="h-10 w-10" />
            <span className="text-2xl font-bold text-amber-600">ArtWeave</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 text-center">Register your shop</h2>
          <p className="text-sm text-gray-500 text-center mb-6">Your account will be reviewed before going live</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Your full name" required value={form.name} onChange={e => set('name', e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none" />
              <input type="email" placeholder="Email address" required value={form.email} onChange={e => set('email', e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Phone (+237 6XX XXX XXX)" required value={form.phone} onChange={e => set('phone', e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none" />
              <input placeholder="WhatsApp (optional)" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <input placeholder="Shop name" required value={form.shop_name} onChange={e => set('shop_name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none" />
            <textarea placeholder="Shop description (optional)" rows={2} value={form.shop_desc} onChange={e => set('shop_desc', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
            <div className="grid grid-cols-2 gap-4">
              <input type="password" placeholder="Password" required value={form.password} onChange={e => set('password', e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none" />
              <input type="password" placeholder="Confirm password" required value={form.confirm} onChange={e => set('confirm', e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors">
              {loading ? 'Registering...' : 'Register Shop'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
