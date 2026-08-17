import { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useMenu } from '../../hooks/useMenu';
import SectionHeading from '../../components/ui/SectionHeading';
import MenuItemCard from './MenuItemCard';
import { UtensilsCrossed, RefreshCw, Sparkles, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';

// Category visual icon mapping for non-reading/low-literacy users
const CATEGORY_ICONS = {
  fries: '🍟',
  burger: '🍔',
  samosa: '🥟',
  roll: '🌯',
  naan: '🫓',
  'cold drinks & juices': '🥤',
  'cold drinks': '🥤',
};

const CATEGORY_URDU = {
  fries: 'فرائز',
  burger: 'برگر',
  samosa: 'سموسہ',
  roll: 'رول',
  naan: 'نان',
  'cold drinks & juices': 'کولڈ ڈرنکس',
  'cold drinks': 'کولڈ ڈرنکس',
};

export default function MenuGrid() {
  const { menu, loading, error, refetch } = useMenu();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const shouldReduceMotion = useReducedMotion();

  const categories = useMemo(() => {
    return Array.isArray(menu) ? menu : [];
  }, [menu]);

  const filteredCategories = useMemo(() => {
    if (selectedCategory === 'ALL') {
      return categories;
    }
    return categories.filter(
      (cat) => cat.id.toString() === selectedCategory || cat.name.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [categories, selectedCategory]);

  const totalItemCount = useMemo(() => {
    return categories.reduce((acc, cat) => acc + (cat.items?.length || 0), 0);
  }, [categories]);

  return (
    <motion.section
      id="menu"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full py-6 sm:py-10 scroll-mt-20"
    >
      <SectionHeading
        badge="Our Fresh Menu • مینو"
        icon={UtensilsCrossed}
        title="Explore What's Cooking"
        subtitle="Tap 'Order on WhatsApp' on any item to talk directly with the shop"
      />

      {/* Category Filter Pills (Mobile-First horizontal touch scroll) */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 my-6 no-scrollbar scroll-smooth">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`min-h-[44px] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 border flex items-center gap-2 ${
              selectedCategory === 'ALL'
                ? 'bg-accent-primary text-white border-accent-primary shadow-lg shadow-accent-primary/20 scale-102'
                : 'bg-bg-surface text-text-secondary border-border-subtle hover:text-text-primary hover:border-accent-primary/40'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>All Items • تمام ({totalItemCount})</span>
          </button>

          {categories.map((cat) => {
            const icon = cat.icon || CATEGORY_ICONS[cat.name.toLowerCase()] || '🍽️';
            const urdu = cat.urduName || CATEGORY_URDU[cat.name.toLowerCase()] || '';

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id.toString())}
                className={`min-h-[44px] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 border flex items-center gap-2 ${
                  selectedCategory === cat.id.toString()
                    ? 'bg-accent-primary text-white border-accent-primary shadow-lg shadow-accent-primary/20 scale-102'
                    : 'bg-bg-surface text-text-secondary border-border-subtle hover:text-text-primary hover:border-accent-primary/40'
                }`}
              >
                <span className="text-base" role="img" aria-hidden="true">
                  {icon}
                </span>
                <span>{cat.name}</span>
                {urdu && <span className="text-xs opacity-90">({urdu})</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-80 rounded-2xl bg-bg-surface border border-border-subtle animate-pulse p-4 flex flex-col justify-between"
            >
              <div className="w-full aspect-[16/10] bg-border-subtle/50 rounded-xl" />
              <div className="space-y-2 mt-4">
                <div className="h-5 bg-border-subtle rounded w-2/3" />
                <div className="h-4 bg-border-subtle/60 rounded w-1/2" />
              </div>
              <div className="h-11 bg-border-subtle rounded-xl mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Error / Offline Banner with Retry */}
      {error && !loading && categories.length === 0 && (
        <div className="text-center py-10 px-6 rounded-3xl bg-bg-surface border border-border-subtle my-6 space-y-4">
          <p className="text-text-secondary text-sm sm:text-base">
            Could not connect to the menu API at the moment.
          </p>
          <Button variant="outline" size="md" icon={RefreshCw} onClick={refetch}>
            Retry Loading Menu
          </Button>
        </div>
      )}

      {/* Menu Categories List */}
      {!loading && filteredCategories.length > 0 && (
        <div className="space-y-10 sm:space-y-12">
          {filteredCategories.map((category) => {
            const icon = category.icon || CATEGORY_ICONS[category.name.toLowerCase()] || '🍽️';
            const urdu = category.urduName || CATEGORY_URDU[category.name.toLowerCase()] || '';

            return (
              <div key={category.id} className="space-y-4">
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-border-subtle pb-3 gap-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl" role="img" aria-hidden="true">
                      {icon}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-accent-secondary">
                      {category.name}
                    </h3>
                    {urdu && (
                      <span className="text-sm sm:text-base font-bold text-text-primary px-2 py-0.5 rounded bg-bg-surface border border-border-subtle">
                        {urdu}
                      </span>
                    )}
                  </div>
                  {category.description && (
                    <p className="text-xs sm:text-sm text-text-secondary">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Items Grid (1-col on phone 360-480px, 2-col on sm/md/lg) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {category.items?.map((item, index) => (
                    <MenuItemCard key={item.id} item={item} index={index} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCategories.length === 0 && categories.length > 0 && (
        <div className="text-center py-12 rounded-3xl bg-bg-surface border border-border-subtle p-6 space-y-3">
          <Filter className="w-10 h-10 text-accent-secondary/50 mx-auto" />
          <p className="text-text-secondary text-sm">
            No items found in this category.
          </p>
          <Button variant="outline" size="sm" onClick={() => setSelectedCategory('ALL')}>
            View All Categories
          </Button>
        </div>
      )}
    </motion.section>
  );
}
