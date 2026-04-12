import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  LayoutGrid,
  Table2,
  Armchair,
  Archive,
  DoorOpen,
  AppWindow,
  Cross,
  BookMarked,
  Sofa,
  BedDouble,
} from 'lucide-react';

interface CategoryNavProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  all:       <LayoutGrid  className="h-4 w-4" />,
  tables:    <Table2      className="h-4 w-4" />,
  chairs:    <Armchair    className="h-4 w-4" />,
  cabinets:  <Archive     className="h-4 w-4" />,
  doors:     <DoorOpen    className="h-4 w-4" />,
  windows:   <AppWindow   className="h-4 w-4" />,
  coffins:   <Cross       className="h-4 w-4" />,
  cupboards: <BookMarked  className="h-4 w-4" />,
  couche:    <Sofa        className="h-4 w-4" />,
  beds:      <BedDouble   className="h-4 w-4" />,
};

export function CategoryNav({ categories, selectedCategory, onCategorySelect }: CategoryNavProps) {
  const { i18n } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const getLabel = (cat: string) => {
    const labels: Record<string, { en: string; fr: string }> = {
      all:       { en: 'All',       fr: 'Tout'      },
      tables:    { en: 'Tables',    fr: 'Tables'    },
      chairs:    { en: 'Chairs',    fr: 'Chaises'   },
      cabinets:  { en: 'Cabinets',  fr: 'Armoires'  },
      doors:     { en: 'Doors',     fr: 'Portes'    },
      windows:   { en: 'Windows',   fr: 'Fenêtres'  },
      coffins:   { en: 'Coffins',   fr: 'Cercueils' },
      cupboards: { en: 'Cupboards', fr: 'Placards'  },
      couche:    { en: 'Sofas',     fr: 'Canapés'   },
      beds:      { en: 'Beds',      fr: 'Lits'      },
    };
    const lang = i18n.language === 'fr' ? 'fr' : 'en';
    return labels[cat]?.[lang] ?? cat.charAt(0).toUpperCase() + cat.slice(1);
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
                {categoryIcons[cat] ?? <LayoutGrid className="h-4 w-4" />}
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
