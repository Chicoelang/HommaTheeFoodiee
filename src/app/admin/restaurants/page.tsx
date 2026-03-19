// src/app/restaurants/page.tsx
'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, UtensilsCrossed, X } from 'lucide-react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useCategories } from '@/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type SortOption = 'newest' | 'rating' | 'most_reviewed';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'rating', label: 'Rating Tertinggi' },
  { value: 'most_reviewed', label: 'Paling Banyak Ulasan' },
];

const PAGE_SIZE = 12;

export default function RestaurantsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce 400ms — tidak perlu tombol "Cari" lagi
  const debouncedSearch = useDebounce(searchInput, 400);

  const { data: categories } = useCategories();
  const { data, isLoading, isFetching } = useRestaurants({
    search: debouncedSearch,
    categoryId,
    sortBy,
    page,
    pageSize: PAGE_SIZE,
  });

  // Reset page ke 1 setiap kali filter/search berubah
  const handleCategoryChange = (id: string) => {
    setCategoryId(id);
    setPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput('');
    setCategoryId('');
    setSortBy('newest');
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || categoryId || sortBy !== 'newest';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header sticky */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search — tanpa form submit, langsung debounce */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Cari restoran..."
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              />
              {/* Tombol clear search */}
              {searchInput && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors',
                showFilters
                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-orange-500" />
              )}
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Kategori
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                      !categoryId
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'border-gray-200 text-gray-700 hover:border-orange-300'
                    )}
                  >
                    Semua
                  </button>
                  {categories?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                        categoryId === cat.id
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-orange-300'
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Urutkan
                </p>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSortChange(opt.value)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                        sortBy === opt.value
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-orange-300'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-500 hover:underline font-medium"
                >
                  Hapus semua filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {debouncedSearch ? `Hasil untuk "${debouncedSearch}"` : 'Semua Restoran'}
            </h1>
            {data && (
              <p className="text-sm text-gray-500 mt-1">
                {/* isFetching saat debounce sedang proses — tapi data lama masih tampil */}
                {isFetching && !isLoading
                  ? 'Memperbarui...'
                  : `Menampilkan ${data.data.length} dari ${data.total} restoran`}
              </p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="text-center py-20">
            <UtensilsCrossed className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 font-semibold text-lg">Restoran tidak ditemukan</h3>
            <p className="text-gray-400 text-sm mt-1 mb-4">Coba ubah pencarian atau filter</p>
            <Button variant="outline" onClick={clearFilters}>
              Hapus Filter
            </Button>
          </div>
        ) : (
          <>
            {/* Overlay tipis saat refetch (debounce sedang update) */}
            <div className={cn('transition-opacity', isFetching && !isLoading ? 'opacity-60' : 'opacity-100')}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {data?.data?.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            </div>
            <div className="mt-10">
              <Pagination
                currentPage={page}
                totalPages={data?.totalPages ?? 1}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}