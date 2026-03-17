import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface CategoryNavProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const categoryEmojis: Record<string, string> = {
  all: '🛍️',
  tables: '🪑',
  chairs: '💺',
  cabinets: '🗄️',
  doors: '🚪',
  windows: '🪟',
  coffins: '⚰️',
  cupboards: '🗃️',
  couche: '🛋️',
  beds: '🛏️',
};

export function CategoryNav({ categories, selectedCategory, onCategorySelect }: CategoryNavProps) {
  const { t, i18n } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const getLabel = (cat: string) => {
    if (cat === 'all') return i18n.language === 'fr' ? 'Tout' : 'All';
    if (cat === 'couche') return i18n.language === 'fr' ? 'Canapés' : 'Couches';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <motion.button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-200 dark:shadow-amber-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
              >
                <span className="text-base leading-none">{categoryEmojis[cat] ?? '📦'}</span>
                <span>{getLabel(cat)}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-amber-500 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
