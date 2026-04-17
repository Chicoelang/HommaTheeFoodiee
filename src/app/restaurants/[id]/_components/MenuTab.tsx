// src/app/restaurants/[id]/_components/MenuTab.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { Menu } from '@/types';
import { MenuCardSkeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/lib/utils';
import { motion } from '@/components/providers/MotionProvider';
import { StaggerGrid, StaggerItem } from '@/components/providers/MotionProvider';

interface MenuTabProps {
  menus: Menu[] | undefined;
  isLoading: boolean;
  onReviewClick?: (menu: Menu) => void;
}

// Warna gradient berdasarkan huruf pertama nama menu
const PLACEHOLDER_GRADIENTS = [
  'from-orange-400 to-red-400',
  'from-amber-400 to-orange-500',
  'from-red-400 to-pink-500',
  'from-orange-500 to-amber-400',
  'from-yellow-400 to-orange-400',
];

function getGradient(name: string): string {
  return PLACEHOLDER_GRADIENTS[name.charCodeAt(0) % PLACEHOLDER_GRADIENTS.length];
}

// Komponen gambar menu:
// - Kalau image_url di database diisi URL foto asli → tampilkan foto
// - Kalau kosong / placeholder dummy → tampilkan gradient warna
function MenuImage({ src, alt }: { src: string | null; alt: string }) {
  const [imgError, setImgError] = useState(false);

  const isValidUrl =
    src &&
    src !== 'https://via.placeholder.com/150' &&
    src !== 'https://placehold.co/150x150';

  if (!isValidUrl || imgError) {
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getGradient(alt)} 
                    flex items-center justify-center`}
      >
        <UtensilsCrossed className="w-8 h-8 text-white/60" />
      </div>
    );
  }

  return (
    <Image
      src={src!}
      alt={alt}
      fill
      className="object-cover"
      sizes="96px"
      unoptimized
      onError={() => setImgError(true)}
    />
  );
}

export function MenuTab({ menus, isLoading, onReviewClick }: MenuTabProps) {
  if (isLoading) {
    return (
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MenuCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!menus || menus.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-gray-400">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <UtensilsCrossed className="w-7 h-7 text-gray-300" />
        </div>
        <p className="text-sm font-medium">Belum ada menu tersedia</p>
        <p className="text-xs text-gray-300 mt-1">Menu akan segera ditambahkan</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {menus.map((item) => (
          <StaggerItem key={item.id}>
            <motion.div
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="flex gap-4 p-4 rounded-2xl border border-gray-100 
                         hover:border-orange-100 hover:bg-orange-50/40 
                         bg-white shadow-sm hover:shadow-md 
                         transition-colors duration-200 cursor-default"
            >
              {/* Gambar menu */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                <MenuImage src={item.image_url} alt={item.name} />
              </div>

              {/* Info menu */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1 mb-1">
                    {item.name}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-base font-extrabold text-orange-500 tracking-tight">
                    {formatCurrency(item.price)}
                  </span>

                  {/* Tombol "+" — pergi ke ulasan */}
                  <div
                    onClick={() => onReviewClick?.(item)}
                    className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 
                               flex items-center justify-center shadow-md shadow-orange-200
                               hover:from-orange-600 hover:to-red-500 transition-all duration-200
                               cursor-pointer select-none"
                    title="Beri Ulasan / Lihat Ulasan"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </div>
  );
}