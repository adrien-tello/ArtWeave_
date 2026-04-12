import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Seller, auth } from '../lib/api';

type Role = 'user' | 'seller' | 'admin' | null;

interface AuthState {
  role: Role;
  user: User | null;
  seller: Seller | null;
  admin: { id: string; username: string } | null;
}

interface AuthContextType extends AuthState {
  loginUser:    (email: string, password: string) => Promise<void>;
  loginSeller:  (email: string, password: string) => Promise<void>;
  loginAdmin:   (username: string, password: string) => Promise<void>;
  registerUser: (name: string, email: string, phone: string, password: string) => Promise<void>;
  registerSeller: (data: { name: string; email: string; phone: string; whatsapp?: string; shop_name: string; shop_desc?: string; password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hydrated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ role: null, user: null, seller: null, admin: null });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('auth_state');
    if (saved) setState(JSON.parse(saved));
    setHydrated(true); // mark as restored regardless
  }, []);

  function persist(next: AuthState, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('auth_state', JSON.stringify(next));
    setState(next);
  }

  const loginUser = async (email: string, password: string) => {
    const res = await auth.loginUser({ email, password });
    persist({ role: 'user', user: res.user, seller: null, admin: null }, res.token);
  };

  const loginSeller = async (email: string, password: string) => {
    const res = await auth.loginSeller({ email, password });
    persist({ role: 'seller', user: null, seller: res.seller, admin: null }, res.token);
  };

  const loginAdmin = async (username: string, password: string) => {
    const res = await auth.loginAdmin({ username, password });
    persist({ role: 'admin', user: null, seller: null, admin: res.admin }, res.token);
  };

  const registerUser = async (name: string, email: string, phone: string, password: string) => {
    const res = await auth.registerUser({ name, email, phone, password });
    persist({ role: 'user', user: res.user, seller: null, admin: null }, res.token);
  };

  const registerSeller = async (data: Parameters<typeof auth.registerSeller>[0]) => {
    const res = await auth.registerSeller(data);
    persist({ role: 'seller', user: null, seller: res.seller, admin: null }, res.token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_state');
    setState({ role: null, user: null, seller: null, admin: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, loginUser, loginSeller, loginAdmin, registerUser, registerSeller, logout, isAuthenticated: !!state.role, hydrated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
