import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { Logo } from '../components/Logo';

export function About() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/home"
          className="inline-flex items-center text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Logo className="h-20 w-20 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('aboutTitle')}
            </h1>
          </div>

          <div className="prose prose-amber dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {t('aboutDescription')}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('ourStory')}
            </h2>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {t('ourStoryText')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-3">
                  Our Specialties
                </h3>
                <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                  <li>• Custom furniture design</li>
                  <li>• Traditional woodworking</li>
                  <li>• Modern carpentry solutions</li>
                  <li>• Restoration services</li>
                </ul>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-3">
                  Contact Information
                </h3>
                <div className="text-gray-700 dark:text-gray-300 space-y-2">
                  <p>📧 contact@boisetart.com</p>
                  <p>📞 +123 456 789</p>
                  <p>📍 Workshop Location</p>
                  <p>🕒 Mon-Sat: 8AM-6PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}