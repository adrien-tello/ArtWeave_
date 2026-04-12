import React, { useState, useEffect } from 'react';
import { LogOut, Users, Store, ShoppingBag, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { admin as adminApi, Seller, User, Order } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

type Tab = 'sellers' | 'users' | 'orders';

export function Admin() {
  const { role, admin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('sellers');
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (role !== 'admin') { navigate('/login'); return; }
    adminApi.sellers().then(setSellers).catch(console.error);
    adminApi.users().then(setUsers).catch(console.error);
    adminApi.allOrders().then(setOrders).catch(console.error);
  }, [role, navigate]);

  const toggleApproval = async (id: string, current: boolean) => {
    const updated = await adminApi.approveSeller(id, !current);
    setSellers(s => s.map(x => x.id === id ? { ...x, is_approved: updated.is_approved } : x));
    toast.success(updated.is_approved ? 'Seller approved' : 'Seller suspended');
  };

  if (role !== 'admin') return null;

  const tabs = [
    { key: 'sellers', icon: Store, label: `Sellers (${sellers.length})` },
    { key: 'users', icon: Users, label: `Buyers (${users.length})` },
    { key: 'orders', icon: ShoppingBag, label: `Orders (${orders.length})` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-amber-600">ArtWeave Admin</h1>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">{admin?.username}</span>
            <button onClick={() => { logout(); navigate('/'); }} className="flex items-center space-x-1 text-gray-500 hover:text-red-500 text-sm">
              <LogOut className="h-4 w-4" /> <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Sellers', value: sellers.length, sub: `${sellers.filter(s => s.is_approved).length} approved` },
            { label: 'Total Buyers', value: users.length, sub: 'registered' },
            { label: 'Total Orders', value: orders.length, sub: `${orders.filter(o => o.payment_status === 'paid').length} paid` },
          ].map(stat => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm text-center">
              <p className="text-3xl font-bold text-amber-600">{stat.value}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{stat.label}</p>
              <p className="text-xs text-gray-500">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 w-fit">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key as Tab)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-white dark:bg-gray-700 shadow text-amber-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              <t.icon className="h-4 w-4" /> <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Sellers */}
        {tab === 'sellers' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>{['Shop', 'Owner', 'Email', 'Phone', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sellers.map(s => (
                  <tr key={s.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{s.shop_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{s.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{s.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{s.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {s.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleApproval(s.id, s.is_approved)}
                        className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${s.is_approved ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
                        {s.is_approved ? <><XCircle className="h-3.5 w-3.5" /><span>Suspend</span></> : <><CheckCircle className="h-3.5 w-3.5" /><span>Approve</span></>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>{['Name', 'Email', 'Phone', 'Joined'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{u.phone || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(u.created_at!).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>{['Buyer', 'Shop', 'Amount', 'Status', 'Payment', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map(o => (
                  <tr key={o.id}>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{o.buyer_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{o.shop_name}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-amber-600">{Number(o.total_amount).toLocaleString()} FCFA</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${o.payment_status === 'paid' ? 'bg-green-100 text-green-700' : o.payment_status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {o.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
