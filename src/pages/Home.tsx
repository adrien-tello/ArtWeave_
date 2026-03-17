import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { CategoryNav } from '../components/CategoryNav';
import { ProductGrid } from '../components/ProductGrid';
import { Product } from '../lib/supabase';
import { sampleProducts } from '../data/sampleProducts';

const categories = ['all', 'tables', 'chairs', 'cabinets', 'doors', 'windows', 'coffins', 'cupboards', 'couche','beds'];

// Loading skeleton component
function ProductSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300 dark:bg-gray-600" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
    </div>
  );
}

export function Home() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for better UX
    const loadProducts = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const productsWithIds: Product[] = sampleProducts.map((product, index) => ({
        ...product,
        id: `product-${index + 1}`,
        created_at: new Date().toISOString(),
      }));
      
      setProducts(productsWithIds);
      setFilteredProducts(productsWithIds);
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name_fr.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const statsVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5, delay: 0.2 }
    }
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300"
    >
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          variants={sectionVariants}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 dark:from-amber-400 dark:via-amber-500 dark:to-amber-600 bg-clip-text text-transparent mb-4"
            whileHover={{ scale: 1.02 }}
          >
            {selectedCategory === 'all' ? 'Discover Our Collection' : t(selectedCategory)}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto"
            variants={sectionVariants}
          >
            Handcrafted furniture pieces that blend traditional artistry with modern design
          </motion.p>

          {/* Stats */}
          <motion.div 
            variants={statsVariants}
            className="flex justify-center items-center space-x-8 mb-8"
          >
            <div className="text-center">
              <motion.div 
                className="text-3xl font-bold text-amber-600 dark:text-amber-400"
                animate={{ 
                  scale: [1, 1.1, 1],
                  transition: { duration: 2, repeat: Infinity }
                }}
              >
                {isLoading ? '...' : filteredProducts.length}
              </motion.div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Products Found</div>
            </div>
            
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-600" />
            
            <div className="text-center">
              <motion.div 
                className="text-3xl font-bold text-amber-600 dark:text-amber-400"
                animate={{ 
                  scale: [1, 1.1, 1],
                  transition: { duration: 2, repeat: Infinity, delay: 0.5 }
                }}
              >
                {categories.length - 1}
              </motion.div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Categories</div>
            </div>
            
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-600" />
            
            <div className="text-center">
              <motion.div 
                className="text-3xl font-bold text-amber-600 dark:text-amber-400"
                animate={{ 
                  scale: [1, 1.1, 1],
                  transition: { duration: 2, repeat: Infinity, delay: 1 }
                }}
              >
                100%
              </motion.div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Handcrafted</div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Products Section */}
        <motion.div variants={sectionVariants}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ProductGrid products={filteredProducts} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Call to Action */}
        {!isLoading && filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-16 py-12 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We create custom furniture pieces tailored to your specific needs
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Contact Us for Custom Orders
            </motion.button>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}