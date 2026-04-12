import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Heart, Phone, MessageCircle, Mail, Store, ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { products as productsApi, Product } from '../lib/api';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { Header } from '../components/Header';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { i18n } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();

  useEffect(() => {
    if (id) {
      productsApi.get(id).then(setProduct).catch(() => setProduct(null)).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header searchTerm={search} onSearchChange={setSearch} />
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" />
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header searchTerm={search} onSearchChange={setSearch} />
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Product not found</p>
      </div>
    </div>
  );

  const name = i18n.language === 'fr' ? product.name_fr : product.name;
  const description = i18n.language === 'fr' ? product.description_fr : product.description;
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header searchTerm={search} onSearchChange={setSearch} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/home" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6 text-sm">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative">
            <img src={product.image_url} alt={name} className="w-full h-96 object-cover rounded-2xl shadow-lg" />
            <button onClick={() => { inWishlist ? removeFromWishlist(product.id) : addToWishlist(product as never); }}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-colors ${inWishlist ? 'bg-red-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 hover:text-red-500'}`}>
              <Heart className="h-5 w-5" fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <p className="text-sm text-amber-600 font-medium mb-1">{product.shop_name}</p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{name}</h1>
              <p className="text-2xl font-bold text-amber-600 mt-2">{product.price.toLocaleString()} FCFA</p>
            </div>

            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${product.in_stock ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
              {product.in_stock ? 'In Stock' : 'Out of Stock'}
            </span>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>

            {/* Seller contact */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Store className="h-5 w-5 text-amber-600" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">{product.shop_name}</span>
                <span className="text-sm text-gray-500">by {product.seller_name}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.seller_phone && (
                  <a href={`tel:${product.seller_phone}`}
                    className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                    <Phone className="h-4 w-4 mr-1.5" /> Call Seller
                  </a>
                )}
                {product.seller_whatsapp && (
                  <a href={`https://wa.me/${product.seller_whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                    className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors">
                    <MessageCircle className="h-4 w-4 mr-1.5" /> WhatsApp
                  </a>
                )}
              </div>
            </div>

            {/* Add to cart */}
            <button onClick={() => addItem(product.id)} disabled={!product.in_stock}
              className="w-full py-3 px-6 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>{product.in_stock ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>

            <Link to="/cart"
              className="block w-full py-3 px-6 border-2 border-amber-500 text-amber-600 font-semibold rounded-xl text-center hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
              View Cart & Checkout
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
