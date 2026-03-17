import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Heart, Mail, Phone, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Product } from '../lib/supabase';
import { sampleProducts } from '../data/sampleProducts';
import { useWishlist } from '../hooks/useWishlist';
import { Header } from '../components/Header';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (id) {
      const productIndex = parseInt(id.replace('product-', '')) - 1;
      if (productIndex >= 0 && productIndex < sampleProducts.length) {
        const foundProduct: Product = {
          ...sampleProducts[productIndex],
          id,
          created_at: new Date().toISOString(),
        };
        setProduct(foundProduct);
      }
    }
  }, [id]);

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">Product not found</p>
        </div>
      </div>
    );
  }

  const productName = i18n.language === 'fr' ? product.name_fr : product.name;
  const productDescription =
    i18n.language === 'fr' ? product.description_fr : product.description;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/home"
          className="inline-flex items-center text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative">
            <img
              src={product.image_url}
              alt={productName}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-4 right-4 p-3 rounded-full transition-colors duration-300 ${
                isInWishlist(product.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-red-500'
              }`}
            >
              <Heart
                className="h-5 w-5"
                fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {productName}
              </h1>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {product.price.toLocaleString()} FCFA
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('availability')}:
              </span>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  product.in_stock
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}
              >
                {product.in_stock ? t('inStock') : t('outOfStock')}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {t('description')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {productDescription}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t('contactSeller')}
              </h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:vislarenawa@gmail.com"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {t('email')}
                </a>
                <a
                  href="tel:+237682965309"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {t('phone')}
                </a>
                <a
                  href="https://wa.me/237651882995"
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {t('whatsapp')}
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowOrderForm(true)}
              disabled={!product.in_stock}
              className="w-full py-3 px-6 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {t('placeOrder')}
            </button>
          </div>
        </div>

        {showOrderForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {t('orderProduct')}
              </h2>
              <form
                action="https://formsubmit.co/mickeyjovany458@gmail.com"
                method="POST"
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const name = (form.querySelector('[name="Full Name"]') as HTMLInputElement).value;
                  const email = (form.querySelector('[name="Email"]') as HTMLInputElement).value;
                  const phone = (form.querySelector('[name="Phone"]') as HTMLInputElement).value;
                  const message = (form.querySelector('[name="Message"]') as HTMLInputElement).value;
                  const productInfo = `${productName} - ${product.price.toLocaleString()} FCFA`;

                  const encodedMsg = encodeURIComponent(
                    `🛒 Nouvelle commande:\n\n🪵 Produit: ${productInfo}\n👤 Nom: ${name}\n📧 Email: ${email}\n📱 Téléphone: ${phone}\n📝 Message: ${message}`
                  );

                  window.open(`https://wa.me/237651882995?text=${encodedMsg}`, '_blank');

                  form.submit(); // Submits to FormSubmit after opening WhatsApp
                }}
              >
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_subject" value="Nouvelle commande" />
                <input type="hidden" name="_autoresponse" value="Merci pour votre commande. Nous vous contacterons bientôt !" />
                <input type="hidden" name="_captcha" value="false" />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('fullName')}
                  </label>
                  <input
                    type="text"
                    name="Full Name"
                    required
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('emailAddress')}
                  </label>
                  <input
                    type="email"
                    name="Email"
                    required
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('phoneNumber')}
                  </label>
                  <input
                    type="text"
                    name="Phone"
                    required
                    defaultValue="+237 651882995"
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('message')}
                  </label>
                  <textarea
                    name="Message"
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="flex-1 py-2 px-4 border rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                  >
                    {t('submitOrder')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
