import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/Header';
import { useState } from 'react';

export function Cart() {
  const { items, total, updateItem, removeItem, loading } = useCart();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  if (role !== 'user') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header searchTerm={search} onSearchChange={setSearch} />
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-gray-500">Please login to view your cart</p>
          <Link to="/login" className="px-6 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header searchTerm={search} onSearchChange={setSearch} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/home" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6 text-sm">
          <ArrowLeft className="h-4 w-4 mr-1" /> Continue shopping
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Your Cart</h1>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto" />
            <p className="text-gray-500 text-lg">Your cart is empty</p>
            <Link to="/home" className="inline-block px-6 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
                  <img src={item.image_url} alt={item.name} className="h-20 w-20 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-amber-600 font-medium">{item.shop_name}</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                    <p className="text-amber-600 font-bold">{item.price.toLocaleString()} FCFA</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => updateItem(item.id, item.quantity - 1)}
                      className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-900 dark:text-gray-100">{item.quantity}</span>
                    <button onClick={() => updateItem(item.id, item.quantity + 1)}
                      className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-2 text-red-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm h-fit space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Order Summary</h2>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{total.toLocaleString()} FCFA</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between font-bold text-gray-900 dark:text-gray-100">
                <span>Total</span>
                <span className="text-amber-600">{total.toLocaleString()} FCFA</span>
              </div>
              <button onClick={() => navigate('/checkout')}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
