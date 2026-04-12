import React, { useState } from 'react';
import { Search, Heart, Sun, Moon, Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { useTheme } from '../hooks/useTheme';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function Header({ searchTerm, onSearchChange }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const { wishlist } = useWishlist();
  const { count } = useCart();
  const { role, user, seller, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <Logo className="h-9 w-9" />
            <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-600 bg-clip-text text-transparent">
              ArtWeave
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={t('searchProducts')}
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              />
            </div>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center space-x-2">
            <button onClick={toggleLang} className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              {i18n.language.toUpperCase()}
            </button>
            <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link to="/wishlist" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{wishlist.length}</span>
              )}
            </Link>

            {role === 'user' && (
              <Link to="/cart" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <ShoppingCart className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{count}</span>
                )}
              </Link>
            )}

            {role ? (
              <div className="flex items-center space-x-2 ml-2">
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {role === 'user' ? user?.name : role === 'seller' ? seller?.shop_name : 'Admin'}
                </span>
                {role === 'seller' && (
                  <Link to="/seller/dashboard" className="text-sm px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-200 font-medium">
                    Dashboard
                  </Link>
                )}
                {role === 'admin' && (
                  <Link to="/admin" className="text-sm px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-200 font-medium">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="ml-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors">
                Login
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600 dark:text-gray-300">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-3 overflow-hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input type="text" placeholder={t('searchProducts')} value={searchTerm} onChange={e => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
              </div>
              <div className="flex items-center justify-between px-1">
                <button onClick={toggleLang} className="text-sm text-gray-600 dark:text-gray-300">{i18n.language.toUpperCase()}</button>
                <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300">{isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
                <Link to="/wishlist" className="relative p-2 text-gray-600 dark:text-gray-300" onClick={() => setMobileOpen(false)}>
                  <Heart className="h-5 w-5" />
                  {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{wishlist.length}</span>}
                </Link>
                {role === 'user' && (
                  <Link to="/cart" className="relative p-2 text-gray-600 dark:text-gray-300" onClick={() => setMobileOpen(false)}>
                    <ShoppingCart className="h-5 w-5" />
                    {count > 0 && <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{count}</span>}
                  </Link>
                )}
                {role ? (
                  <button onClick={handleLogout} className="p-2 text-red-500"><LogOut className="h-5 w-5" /></button>
                ) : (
                  <Link to="/login" className="px-3 py-1.5 bg-amber-500 text-white text-sm font-semibold rounded-xl" onClick={() => setMobileOpen(false)}>Login</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
