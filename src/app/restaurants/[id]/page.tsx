// src/app/restaurants/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { UtensilsCrossed, MessageSquare } from 'lucide-react';
import { useRestaurant } from '../../../hooks/useRestaurants';
import { useMenus } from '../../../hooks/useMenus';
import { useReviews } from '../../../hooks/useReviews';
import { useIsFavorite, useToggleFavorite } from '../../../hooks/useFavorites';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import { Menu } from '@/types';
import { RestaurantHeader, RestaurantHeaderSkeleton } from './_components/RestaurantHeader';
import { RestaurantInfo } from './_components/RestaurantInfo';
import { MenuTab } from './_components/MenuTab';
import { ReviewTab } from './_components/ReviewTab';

type Tab = 'menu' | 'reviews';

export default function RestaurantDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { user } = useAuthStore();
  const { addToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const [selectedMenusToReview, setSelectedMenusToReview] = useState<Menu[]>([]);

  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(id);
  const { data: menus, isLoading: menusLoading } = useMenus(id);
  const { data: reviews, isLoading: reviewsLoading, isError: reviewsError } = useReviews(id);
  const { data: isFavorite } = useIsFavorite(user?.id ?? '', id);
  const { mutate: toggleFavorite, isPending: favoriteLoading } = useToggleFavorite();

  const handleFavoriteToggle = () => {
    if (!user) {
      addToast('info', 'Silakan masuk untuk menyimpan favorit');
      return;
    }
    toggleFavorite(
      { userId: user.id, restaurantId: id, isFavorite: !!isFavorite },
      {
        onSuccess: ({ action }) =>
          addToast(
            'success',
            action === 'added' ? 'Ditambahkan ke favorit!' : 'Dihapus dari favorit'
          ),
        onError: () => addToast('error', 'Terjadi kesalahan'),
      }
    );
  };

  if (restaurantLoading) {
    return (
      <div>
        <RestaurantHeaderSkeleton />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Restoran tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header dengan hero image */}
      <RestaurantHeader
        restaurant={restaurant}
        isFavorite={!!isFavorite}
        isFavoriteLoading={favoriteLoading}
        onFavoriteToggle={handleFavoriteToggle}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Konten utama: tab menu & ulasan */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Tab buttons */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab('menu')}
                  className={cn(
                    'flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors',
                    activeTab === 'menu'
                      ? 'text-orange-600 border-b-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  Menu ({menus?.length ?? 0})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={cn(
                    'flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors',
                    activeTab === 'reviews'
                      ? 'text-orange-600 border-b-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <MessageSquare className="w-4 h-4" />
                  Ulasan ({restaurant.review_count})
                </button>
              </div>

              {/* Tab content */}
              {activeTab === 'menu' ? (
                <MenuTab 
                  menus={menus} 
                  isLoading={menusLoading} 
                  onReviewClick={(menu: Menu) => {
                    setSelectedMenusToReview((prev) => {
                      if (prev.find(m => m.id === menu.id)) return prev;
                      if (prev.length >= 5) {
                        addToast('warning', 'Maksimal 5 menu yang bisa diulas bersamaan');
                        return prev;
                      }
                      return [...prev, menu];
                    });
                    setActiveTab('reviews');
                  }} 
                />
              ) : (
                <ReviewTab
                  restaurantId={id}
                  reviews={reviews}
                  isLoading={reviewsLoading}
                  isError={reviewsError}
                  selectedMenus={selectedMenusToReview}
                  onRemoveSelectedMenu={(menuId) => setSelectedMenusToReview(prev => prev.filter(m => m.id !== menuId))}
                  onClearSelectedMenus={() => setSelectedMenusToReview([])}
                />
              )}
            </div>
          </div>

          {/* Sidebar: info restoran */}
          <div className="lg:col-span-1">
            <RestaurantInfo restaurant={restaurant} />
          </div>
        </div>
      </div>
    </div>
  );
}