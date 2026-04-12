import React from 'react';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Product } from '../lib/api';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';

interface Props { product: Product; index: number }

export function ProductCard({ product, index }: Props) {
  const { t, i18n } = useTranslation();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const name = i18n.language === 'fr' ? product.name_fr : product.name;
  const inWishlist = isInWishlist(product.id);

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      <div className="relative overflow-hidden">
        <img src={product.image_url} alt={name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />

        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.in_stock ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
            {product.in_stock ? t('inStock') : t('outOfStock')}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product as never)}
            className={`p-2 rounded-full shadow-md ${inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 hover:text-red-500'}`}>
            <Heart className="h-4 w-4" fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
          <Link to={`/product/${product.id}`}
            className="p-2 bg-white/90 dark:bg-gray-800/90 text-gray-600 hover:text-amber-600 rounded-full shadow-md">
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="p-4">
        {product.shop_name && (
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">{product.shop_name}</p>
        )}
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
          {name}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
            {product.price.toLocaleString()} FCFA
          </span>
        </div>
        <button
          onClick={() => addItem(product.id)}
          disabled={!product.in_stock}
          className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{product.in_stock ? 'Add to Cart' : t('outOfStock')}</span>
        </button>
      </div>
    </motion.div>
  );
}
