import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { SellerRegister } from './pages/SellerRegister';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Wishlist } from './pages/Wishlist';
import { About } from './pages/About';
import { SellerDashboard } from './pages/SellerDashboard';
import { Admin } from './pages/Admin';
import { AdminLogin } from './pages/AdminLogin';
import './lib/i18n';

function ProtectedRoute({ children, allow }: { children: React.ReactNode; allow: string[] }) {
  const { role, hydrated } = useAuth();
  if (!hydrated) return null; // wait for localStorage restore before deciding
  if (!role || !allow.includes(role)) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ───────────────────────────────────────────── */}
      <Route path="/"                 element={<Landing />} />
      <Route path="/home"             element={<Home />} />
      <Route path="/product/:id"      element={<ProductDetail />} />
      <Route path="/about"            element={<About />} />
      <Route path="/wishlist"         element={<Wishlist />} />

      {/* ── Buyer ───────────────────────────────────────────── */}
      <Route path="/login"            element={<Login />} />
      <Route path="/register"         element={<Register />} />
      <Route path="/cart"             element={<ProtectedRoute allow={['user']}><Cart /></ProtectedRoute>} />
      <Route path="/checkout"         element={<ProtectedRoute allow={['user']}><Checkout /></ProtectedRoute>} />

      {/* ── Seller ───────────────────────────────────────────── */}
      <Route path="/seller/login"     element={<Login defaultTab="seller" />} />
      <Route path="/seller/register"  element={<SellerRegister />} />
      <Route path="/seller/dashboard" element={<ProtectedRoute allow={['seller']}><SellerDashboard /></ProtectedRoute>} />

      {/* ── Admin — completely separate, not linked from public pages ─── */}
      <Route path="/secure-admin-portal" element={<AdminLogin />} />
      <Route path="/admin"            element={<ProtectedRoute allow={['admin']}><Admin /></ProtectedRoute>} />

      <Route path="*"                 element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <CartProvider>
          <AppRoutes />
          <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#1f2937', color: '#f9fafb' } }} />
        </CartProvider>
      </Router>
    </AuthProvider>
  );
}
