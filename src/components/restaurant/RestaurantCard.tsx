'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Heart } from 'lucide-react';
import { Restaurant } from '@/types';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const { data: isFavorite } = useIsFavorite(user?.id ?? '', restaurant.id);
  const { mutate: toggleFavorite, isPending } = useToggleFavorite();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      addToast('info', 'Please login to save favorites');
      return;
    }
    toggleFavorite(
      { userId: user.id, restaurantId: restaurant.id, isFavorite: !!isFavorite },
      {
        onSuccess: ({ action }) => {
          addToast('success', action === 'added' ? 'Added to favorites!' : 'Removed from favorites');
        },
        onError: () => addToast('error', 'Something went wrong'),
      }
    );
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={restaurant.image_url ?? '/placeholder-restaurant.jpg'}
          alt={restaurant.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <button
          onClick={handleFavorite}
          disabled={isPending}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all',
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
          )}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
        </button>
        {restaurant.categories && (
          <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
            {restaurant.categories.name}
          </span>
        )}
      </div>

      <div className="p-4 space-y-2.5">
        <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-1 group-hover:text-orange-500 transition-colors">
          {restaurant.name}
        </h3>

        <div className="flex items-center gap-1.5">
          <StarRating rating={restaurant.avg_rating} size="sm" />
          <span className="text-sm font-medium text-gray-700">
            {restaurant.avg_rating > 0 ? restaurant.avg_rating.toFixed(1) : 'No rating'}
          </span>
          {restaurant.review_count > 0 && (
            <span className="text-xs text-gray-400">({restaurant.review_count})</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-500">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-xs line-clamp-1">{restaurant.location}</span>
        </div>

        {restaurant.opening_hours && (
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs">{restaurant.opening_hours}</span>
          </div>
        )}

        <div className="pt-1">
          <Link href={`/restaurants/${restaurant.id}`}>
            <Button size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
