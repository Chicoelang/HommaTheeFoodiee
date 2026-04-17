// src/app/restaurants/page.tsx
'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, UtensilsCrossed, X, ChevronDown } from 'lucide-react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useCategories } from '@/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import {
  StaggerGrid,
  StaggerItem,
  FadeUp,
  motion,
  AnimatePresence,
} from '@/components/providers/MotionProvider';
import { cn } from '@/lib/utils';

type SortOption = 'newest' | 'rating' | 'most_reviewed';

const SORT_OPTIONS: { value: SortOption; label: string; icon: string }[] = [
  { value: 'newest',       label: 'Terbaru',              icon: '🕐' },
  { value: 'rating',       label: 'Rating Tertinggi',     icon: '⭐' },
  { value: 'most_reviewed',label: 'Paling Banyak Ulasan', icon: '💬' },
];

const PAGE_SIZE = 12;

function RestaurantsContent() {
  const searchParams = useSearchParams();
  const urlCategoryId = searchParams.get('categoryId');

  const [searchInput, setSearchInput] = useState('');
  const [categoryId, setCategoryId] = useState(urlCategoryId || '');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (urlCategoryId !== null) {
      setCategoryId(urlCategoryId);
    }
  }, [urlCategoryId]);

  const debouncedSearch = useDebounce(searchInput, 400);

  const { data: categories } = useCategories();
  const { data, isLoading, isFetching } = useRestaurants({
    search: debouncedSearch,
    categoryId,
    sortBy,
    page,
    pageSize: PAGE_SIZE,
  });

  const handleCategoryChange = (id: string) => { setCategoryId(id); setPage(1); };
  const handleSortChange = (sort: SortOption) => { setSortBy(sort); setPage(1); };
  const handleSearchChange = (value: string) => { setSearchInput(value); setPage(1); };

  const clearFilters = () => {
    setSearchInput('');
    setCategoryId('');
    setSortBy('newest');
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || categoryId || sortBy !== 'newest';
  const activeCategory = categories?.find(c => c.id === categoryId);
  const activeSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sticky search & filter bar ── */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Search input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Cari restoran, masakan, lokasi..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 
                           bg-gray-50 text-sm font-medium text-gray-900 placeholder:text-gray-400
                           focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 
                           focus:bg-white transition-all duration-200"
              />
              <AnimatePresence>
                {searchInput && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => handleSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full 
                               bg-gray-300 hover:bg-gray-400 flex items-center justify-center 
                               transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Filter toggle button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200',
                showFilters || hasActiveFilters
                  ? 'border-orange-400 bg-orange-50 text-orange-600'
                  : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500 bg-white'
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
              {hasActiveFilters && (
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {(categoryId ? 1 : 0) + (sortBy !== 'newest' ? 1 : 0)}
                </span>
              )}
              <motion.div
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </div>

          {/* Active filter chips */}
          <AnimatePresence>
            {hasActiveFilters && !showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 mt-2.5 overflow-hidden"
              >
                <span className="text-xs text-gray-400 font-medium">Filter aktif:</span>
                {activeCategory && (
                  <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 
                                   text-xs font-semibold px-2.5 py-1 rounded-full">
                    {activeCategory.name}
                    <button onClick={() => handleCategoryChange('')} className="hover:text-orange-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {sortBy !== 'newest' && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 
                                   text-xs font-semibold px-2.5 py-1 rounded-full">
                    {activeSortLabel}
                    <button onClick={() => handleSortChange('newest')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {debouncedSearch && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 
                                   text-xs font-semibold px-2.5 py-1 rounded-full">
                    "{debouncedSearch}"
                    <button onClick={() => handleSearchChange('')} className="hover:text-gray-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold ml-1 transition-colors"
                >
                  Hapus semua
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-3 border-t border-gray-100 space-y-4">
                  {/* Category filter */}
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                      Kategori
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCategoryChange('')}
                        className={cn(
                          'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 border',
                          !categoryId
                            ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200'
                            : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500 bg-white'
                        )}
                      >
                        🍴 Semua
                      </motion.button>
                      {categories?.map((cat) => (
                        <motion.button
                          key={cat.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCategoryChange(cat.id)}
                          className={cn(
                            'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 border',
                            categoryId === cat.id
                              ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200'
                              : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500 bg-white'
                          )}
                        >
                          {cat.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Sort filter */}
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                      Urutkan
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SORT_OPTIONS.map((opt) => (
                        <motion.button
                          key={opt.value}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSortChange(opt.value)}
                          className={cn(
                            'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 border',
                            sortBy === opt.value
                              ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200'
                              : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500 bg-white'
                          )}
                        >
                          <span>{opt.icon}</span>
                          {opt.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
                    >
                      Hapus semua filter
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Results section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeUp className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {debouncedSearch ? (
                <>
                  Hasil untuk{' '}
                  <span className="text-orange-500">"{debouncedSearch}"</span>
                </>
              ) : activeCategory ? (
                <>Restoran <span className="text-orange-500">{activeCategory.name}</span></>
              ) : (
                'Semua Restoran'
              )}
            </h1>
            {data && (
              <p className="text-sm text-gray-400 font-medium mt-1">
                {isFetching && !isLoading
                  ? 'Memperbarui...'
                  : `${data.total} restoran ditemukan`}
              </p>
            )}
          </div>
        </FadeUp>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        ) : data?.data?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <UtensilsCrossed className="w-9 h-9 text-gray-300" />
            </div>
            <h3 className="text-gray-700 font-bold text-xl mb-2">
              Restoran tidak ditemukan
            </h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
              Coba ubah pencarian atau hapus filter yang aktif.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Hapus Semua Filter
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.div
              animate={{ opacity: isFetching && !isLoading ? 0.6 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {data?.data?.map((restaurant) => (
                  <StaggerItem key={restaurant.id}>
                    <RestaurantCard restaurant={restaurant} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </motion.div>

            <div className="mt-12">
              <Pagination
                currentPage={page}
                totalPages={data?.totalPages ?? 1}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                isLoading={isFetching && !isLoading}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 font-medium">Memuat restoran...</div>
      </div>
    }>
      <RestaurantsContent />
    </Suspense>
  );
}