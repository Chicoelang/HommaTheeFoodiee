'use client';

import { useAuthStore } from '@/store/authStore';
import { useFavorites } from '@/hooks/useFavorites';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/ui/Skeleton';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const { user } = useAuthStore();
  const { data: favorites, isLoading } = useFavorites(user?.id ?? '');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <h2 className="text-gray-600 font-semibold text-lg mb-2">Masuk untuk melihat favorit kamu</h2>
          <Link href="/login" className="text-orange-500 hover:underline font-medium">Masuk</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Favorit Saya</h1>
          <p className="text-gray-500 mt-1">Restoran yang kamu simpan untuk dikunjungi</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <RestaurantCardSkeleton key={i} />)}
          </div>
        ) : !favorites || favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-500 mb-2">Belum ada favorit</h2>
            <p className="text-gray-400 mb-6">Mulai jelajahi dan simpan restoran yang kamu suka</p>
            <Link href="/restaurants" className="inline-block bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
              Jelajahi Restoran
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((fav) => (
              fav.restaurants && (
                <RestaurantCard key={fav.id} restaurant={fav.restaurants as any} />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
