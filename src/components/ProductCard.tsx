import React from 'react';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Product } from '../lib/supabase';
import { useWishlist } from '../hooks/useWishlist';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const productName = i18n.language === 'fr' ? product.name_fr : product.name;
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      <div className="relative overflow-hidden">
        <motion.img
          variants={imageVariants}
          whileHover="hover"
          src={product.image_url}
          alt={productName}
          className="w-full h-48 object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              inWishlist
                ? 'bg-red-500/90 text-white shadow-lg'
                : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:text-red-500 shadow-md'
            }`}
            title={inWishlist ? t('removeFromWishlist') : t('addToWishlist')}
          >
            <Heart className="h-4 w-4" fill={inWishlist ? 'currentColor' : 'none'} />
          </motion.button>
          
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to={`/product/${product.id}`}
              className="block p-2 bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 rounded-full backdrop-blur-sm shadow-md transition-all duration-300"
              title={t('viewDetails')}
            >
              <Eye className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {/* Stock status badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-3 left-3"
        >
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${
              product.in_stock
                ? 'bg-green-500/90 text-white'
                : 'bg-red-500/90 text-white'
            }`}
          >
            {product.in_stock ? t('inStock') : t('outOfStock')}
          </span>
        </motion.div>
      </div>

      <div className="p-5">
        <motion.h3 
          className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300"
          whileHover={{ scale: 1.02 }}
        >
          {productName}
        </motion.h3>
        
        <div className="flex items-center justify-between mb-4">
          <motion.span 
            className="text-xl font-bold text-amber-600 dark:text-amber-400"
            whileHover={{ scale: 1.05 }}
          >
            {product.price.toLocaleString()} FCFA
          </motion.span>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-yellow-400"
          >
            {'★'.repeat(5)}
          </motion.div>
        </div>

        {/* Quick action button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
          disabled={!product.in_stock}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{product.in_stock ? t('quickOrder') : t('outOfStock')}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}