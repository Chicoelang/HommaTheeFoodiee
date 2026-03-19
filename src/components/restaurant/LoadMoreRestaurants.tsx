// src/components/restaurant/LoadMoreRestaurants.tsx
// Komponen contoh untuk menggunakan useInfiniteRestaurants.
// Bisa dipakai di home page atau di halaman khusus "Jelajahi Semua".

'use client';

import { useRef, useEffect } from 'react';
import { useInfiniteRestaurants } from '@/hooks/useRestaurants';
import { RestaurantCard } from './RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/ui/Skeleton';
import { Loader2 } from 'lucide-react';
import { RestaurantFilters } from '@/types';

interface LoadMoreRestaurantsProps {
  filters?: Omit<RestaurantFilters, 'page'>;
  pageSize?: number;
}

export function LoadMoreRestaurants({
  filters = {},
  pageSize = 12,
}: LoadMoreRestaurantsProps) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteRestaurants(filters, pageSize);

  // Intersection Observer untuk auto-load saat scroll ke bawah
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten semua pages menjadi satu array
  const allRestaurants = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: pageSize }).map((_, i) => (
          <RestaurantCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {allRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

      {/* Sentinel element — dipantau Intersection Observer */}
      <div ref={sentinelRef} className="h-4" />

      {/* Loading indicator saat fetch halaman berikutnya */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        </div>
      )}

      {/* Pesan ketika semua data sudah ditampilkan */}
      {!hasNextPage && allRestaurants.length > 0 && (
        <p className="text-center text-sm text-gray-400 py-8">
          Semua {allRestaurants.length} restoran sudah ditampilkan
        </p>
      )}
    </div>
  );
}