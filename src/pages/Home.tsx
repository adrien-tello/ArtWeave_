import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { CategoryNav } from '../components/CategoryNav';
import { ProductGrid } from '../components/ProductGrid';
import { products as productsApi, Product } from '../lib/api';

const CATEGORIES = ['all', 'tables', 'chairs', 'cabinets', 'doors', 'windows', 'coffins', 'cupboards', 'couche', 'beds'];

function Skeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}

export function Home() {
  const { t } = useTranslation();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.list().then(data => {
      setAllProducts(data);
      setFiltered(data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = allProducts;
    if (category !== 'all') result = result.filter(p => p.category === category);
    if (search) result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.name_fr.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [allProducts, category, search]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header searchTerm={search} onSearchChange={setSearch} />
      <CategoryNav categories={CATEGORIES} selectedCategory={category} onCategorySelect={setCategory} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {category === 'all' ? 'All Products' : t(category)}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 text-gray-500 dark:text-gray-400">
              <p className="text-xl">No products found</p>
              <p className="text-sm mt-2">Try a different category or search term</p>
            </motion.div>
          ) : (
            <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <ProductGrid products={filtered} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
