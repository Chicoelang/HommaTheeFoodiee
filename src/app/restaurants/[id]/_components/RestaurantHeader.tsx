// src/app/restaurants/[id]/_components/RestaurantHeader.tsx
'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Restaurant } from '@/types';
import { StarRating } from '@/components/ui/StarRating';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  isFavorite: boolean;
  isFavoriteLoading: boolean;
  onFavoriteToggle: () => void;
}

export function RestaurantHeader({
  restaurant,
  isFavorite,
  isFavoriteLoading,
  onFavoriteToggle,
}: RestaurantHeaderProps) {
  return (
    <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-gray-200">
      <Image
        src={restaurant.image_url ?? '/placeholder-restaurant.jpg'}
        alt={restaurant.name}
        fill
        className="object-cover"
        // Hapus unoptimized — gunakan next.config.ts remotePatterns
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <div className="max-w-7xl mx-auto flex items-end justify-between gap-4">
          <div>
            {restaurant.categories && (
              <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full mb-3">
                {restaurant.categories.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl font-bold text-white">{restaurant.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={restaurant.avg_rating} size="md" />
              <span className="text-white font-semibold">
                {restaurant.avg_rating > 0
                  ? restaurant.avg_rating.toFixed(1)
                  : 'Belum ada rating'}
              </span>
              <span className="text-white/70 text-sm">
                ({restaurant.review_count} ulasan)
              </span>
            </div>
          </div>
          <button
            onClick={onFavoriteToggle}
            disabled={isFavoriteLoading}
            className={cn(
              'flex-shrink-0 p-3 rounded-2xl backdrop-blur-sm transition-all',
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            )}
            aria-label={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          >
            <Heart className={cn('w-6 h-6', isFavorite && 'fill-current')} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function RestaurantHeaderSkeleton() {
  return (
    <div className="relative h-64 sm:h-80 lg:h-96 bg-gray-200">
      <Skeleton className="w-full h-full rounded-none" />
    </div>
  );
}