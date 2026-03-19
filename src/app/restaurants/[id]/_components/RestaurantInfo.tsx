// src/app/restaurants/[id]/_components/RestaurantInfo.tsx
import { MapPin, Clock, Phone, Star } from 'lucide-react';
import { Restaurant } from '@/types';
import { StarRating } from '@/components/ui/StarRating';

interface RestaurantInfoProps {
  restaurant: Restaurant;
}

export function RestaurantInfo({ restaurant }: RestaurantInfoProps) {
  return (
    <div className="space-y-5">
      {/* About */}
      {restaurant.description && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">Tentang</h2>
          <p className="text-gray-600 leading-relaxed text-sm">{restaurant.description}</p>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-900">Info Restoran</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Alamat</p>
              <p className="text-sm text-gray-700">{restaurant.address}</p>
              <p className="text-xs text-gray-500 mt-0.5">{restaurant.location}</p>
            </div>
          </div>

          {restaurant.opening_hours && (
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Jam Buka</p>
                <p className="text-sm text-gray-700">{restaurant.opening_hours}</p>
              </div>
            </div>
          )}

          {restaurant.phone && (
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Telepon</p>
                <a
                  href={`tel:${restaurant.phone}`}
                  className="text-sm text-orange-500 hover:underline"
                >
                  {restaurant.phone}
                </a>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Star className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Rating</p>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={restaurant.avg_rating} size="sm" />
                <span className="text-sm font-semibold text-gray-900">
                  {restaurant.avg_rating > 0 ? restaurant.avg_rating.toFixed(1) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}