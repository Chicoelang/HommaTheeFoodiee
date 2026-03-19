// src/app/favorites/page.tsx
'use client';

import { useAuthStore } from '@/store/authStore';
import { useFavorites } from '@/hooks/useFavorites';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { StaggerGrid, StaggerItem, FadeUp } from '@/components/providers/MotionProvider';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { user } = useAuthStore();
  const { data: favorites, isLoading } = useFavorites(user?.id ?? '');

  // Tidak login
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState
          variant="not-logged-in"
          actionLabel="Masuk Sekarang"
          actionHref="/login"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FadeUp className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 
                            flex items-center justify-center shadow-lg shadow-red-200">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Favorit Saya
              </h1>
              <p className="text-sm text-gray-400 font-medium mt-0.5">
                {isLoading
                  ? 'Memuat...'
                  : favorites && favorites.length > 0
                  ? `${favorites.length} restoran tersimpan`
                  : 'Restoran yang kamu simpan'}
              </p>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        ) : !favorites || favorites.length === 0 ? (
          <EmptyState
            variant="no-favorites"
            actionLabel="Jelajahi Restoran"
            actionHref="/restaurants"
          />
        ) : (
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((fav) =>
              fav.restaurants ? (
                <StaggerItem key={fav.id}>
                  <RestaurantCard restaurant={fav.restaurants as any} />
                </StaggerItem>
              ) : null
            )}
          </StaggerGrid>
        )}
      </div>
    </div>
  );
} 