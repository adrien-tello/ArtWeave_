import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { orders as ordersApi, payments as paymentsApi } from '../lib/api';
import { useCart } from '../hooks/useCart';
import { Header } from '../components/Header';

type Operator = 'CM_ORANGE' | 'CM_MTN';

export function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ address: '', phone: '', operator: 'CM_ORANGE' as Operator });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) { toast.error('Your cart is empty'); return; }
    setLoading(true);
    try {
      // 1. Place order(s)
      const placedOrders = await ordersApi.place({
        delivery_address: form.address,
        payment_method: form.operator === 'CM_ORANGE' ? 'Orange Money' : 'MTN Mobile Money',
      });

      // 2. Initiate payment for first order (multi-seller orders pay separately)
      const firstOrder = placedOrders[0];
      const { payment_url } = await paymentsApi.initiate({
        order_id: firstOrder.id,
        phone: form.phone,
        operator: form.operator,
      });

      await clearCart();
      toast.success('Redirecting to payment...');

      // 3. Redirect to Monetbil payment page
      window.location.href = payment_url;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header searchTerm={search} onSearchChange={setSearch} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Delivery Information</h2>
              <textarea placeholder="Delivery address (city, neighbourhood, landmark)" required rows={3}
                value={form.address} onChange={e => set('address', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none resize-none text-sm" />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-amber-600" />
                <span>Mobile Payment</span>
              </h2>

              {/* Operator selection */}
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 'CM_ORANGE', label: 'Orange Money', color: 'bg-orange-500' },
                  { value: 'CM_MTN', label: 'MTN MoMo', color: 'bg-yellow-400' },
                ] as { value: Operator; label: string; color: string }[]).map(op => (
                  <button key={op.value} type="button" onClick={() => set('operator', op.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${form.operator === op.value ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-amber-300'}`}>
                    <div className={`w-8 h-8 ${op.color} rounded-full mx-auto mb-2`} />
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{op.label}</p>
                  </button>
                ))}
              </div>

              <input type="tel" placeholder="Mobile number (e.g. 237 6XX XXX XXX)" required
                value={form.phone} onChange={e => set('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none text-sm" />

              <p className="text-xs text-gray-500 dark:text-gray-400">
                You will receive a payment prompt on your phone. Confirm with your PIN to complete the purchase.
              </p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>{loading ? 'Processing...' : `Pay ${total.toLocaleString()} FCFA`}</span>
            </button>
          </form>

          {/* Order summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm h-fit space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img src={item.image_url} alt={item.name} className="h-12 w-12 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-amber-600">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between font-bold text-gray-900 dark:text-gray-100">
              <span>Total</span>
              <span className="text-amber-600">{total.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
