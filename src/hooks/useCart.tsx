import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, cart as cartApi } from '../lib/api';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';

interface CartContextType {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (product_id: string, quantity?: number) => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { role } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role === 'user') {
      setLoading(true);
      cartApi.get().then(setItems).catch(console.error).finally(() => setLoading(false));
    } else {
      setItems([]);
    }
  }, [role]);

  const addItem = async (product_id: string, quantity = 1) => {
    if (role !== 'user') { toast.error('Please login to add to cart'); return; }
    const item = await cartApi.add(product_id, quantity);
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      return exists ? prev.map(i => i.id === item.id ? { ...i, quantity: item.quantity } : i) : [...prev, item];
    });
    toast.success('Added to cart');
  };

  const updateItem = async (id: string, quantity: number) => {
    if (quantity < 1) { await removeItem(id); return; }
    const updated = await cartApi.update(id, quantity);
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: updated.quantity } : i));
  };

  const removeItem = async (id: string) => {
    await cartApi.remove(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = async () => {
    await cartApi.clear();
    setItems([]);
  };

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, total, addItem, updateItem, removeItem, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
