// src/components/restaurant/RestaurantCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Star, Heart } from 'lucide-react';
import { Restaurant } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { useUIStore } from '@/store/uiStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

// Warna avatar berdasarkan karakter pertama nama — konsisten per restoran
function getAvatarColor(name: string): string {
  const colors = [
    'from-orange-500 to-red-500',
    'from-blue-500 to-indigo-500',
    'from-emerald-500 to-teal-500',
    'from-purple-500 to-pink-500',
    'from-amber-500 to-orange-500',
    'from-cyan-500 to-blue-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const { data: isFavorite } = useIsFavorite(user?.id ?? '', restaurant.id);
  const { mutate: toggleFavorite, isPending } = useToggleFavorite();
  const [heartAnimating, setHeartAnimating] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      addToast('info', 'Silakan masuk untuk menyimpan favorit');
      return;
    }
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 400);
    toggleFavorite(
      { userId: user.id, restaurantId: restaurant.id, isFavorite: !!isFavorite },
      {
        onSuccess: ({ action }) => {
          addToast(
            'success',
            action === 'added' ? 'Ditambahkan ke favorit!' : 'Dihapus dari favorit'
          );
        },
        onError: () => addToast('error', 'Terjadi kesalahan'),
      }
    );
  };

  const isOpen = !!restaurant.opening_hours;
  const avatarGradient = getAvatarColor(restaurant.name);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100/80 cursor-pointer"
      style={{ willChange: 'transform' }}
    >
      <Link href={`/restaurants/${restaurant.id}`} className="block">
        {/* ── Image area ── */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
          {restaurant.image_url ? (
            <Image
              src={restaurant.image_url}
              alt={restaurant.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            // Fallback placeholder dengan warna dinamis
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br flex items-center justify-center',
                avatarGradient
              )}
            >
              <span className="text-5xl font-black text-white/30 select-none">
                {restaurant.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Gradient overlay dari bawah */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Category badge — kiri atas */}
          {restaurant.categories && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-orange-500/30 tracking-wide">
                {restaurant.categories.name}
              </span>
            </div>
          )}

          {/* Favorite button — kanan atas */}
          <button
            onClick={handleFavorite}
            disabled={isPending}
            className={cn(
              'absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center',
              'transition-all duration-200 shadow-lg',
              heartAnimating && 'animate-heart-pop',
              isFavorite
                ? 'bg-red-500 shadow-red-500/40'
                : 'bg-white/90 hover:bg-white shadow-black/10'
            )}
            aria-label={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          >
            <Heart
              className={cn(
                'w-4 h-4 transition-colors duration-200',
                isFavorite ? 'fill-white text-white' : 'text-gray-500 hover:text-red-500'
              )}
            />
          </button>

          {/* Rating badge — kiri bawah overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {restaurant.avg_rating > 0 && (
              <div className="flex items-center gap-1.5 bg-black/55 backdrop-blur-sm rounded-lg px-2.5 py-1.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-white">
                  {restaurant.avg_rating.toFixed(1)}
                </span>
                <span className="text-[10px] text-white/70">
                  ({restaurant.review_count})
                </span>
              </div>
            )}
            {/* Open/Close status */}
            {isOpen && (
              <div className="flex items-center gap-1 bg-emerald-500/85 backdrop-blur-sm rounded-lg px-2 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-bold text-white">Buka</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Card body ── */}
        <div className="p-4">
          {/* Name */}
          <h3 className="font-bold text-gray-900 text-[15px] leading-snug line-clamp-1 mb-1.5 group-hover:text-orange-600 transition-colors duration-200">
            {restaurant.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-gray-500 mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
            <span className="text-xs line-clamp-1">{restaurant.location}</span>
          </div>

          {/* Tags row */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {restaurant.opening_hours && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-md">
                <Clock className="w-2.5 h-2.5" />
                {restaurant.opening_hours.length > 14
                  ? restaurant.opening_hours.slice(0, 14) + '…'
                  : restaurant.opening_hours}
              </span>
            )}
            {restaurant.review_count > 0 && (
              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md">
                {restaurant.review_count} ulasan
              </span>
            )}
          </div>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-red-500 
                       text-white text-sm font-bold py-2.5 px-4 rounded-xl 
                       shadow-md shadow-orange-200 transition-all duration-200
                       flex items-center justify-center gap-2"
          >
            Lihat Detail
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
            </svg>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}