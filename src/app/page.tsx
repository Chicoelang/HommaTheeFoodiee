'use client';

import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { useTrendingRestaurants } from '@/hooks/useRestaurants';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/ui/Skeleton';

export default function HomePage() {
  const { data: trending, isLoading: trendingLoading } = useTrendingRestaurants();

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            Jelajahi restoran terbaik Semarang
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3">
            Temukan Tempat Makan<br /><span className="text-amber-100">Favoritmu di Semarang</span>
          </h1>
          <p className="text-sm text-orange-100 max-w-lg mx-auto">
            Jelajahi ragam kuliner khas Semarang. Baca ulasan, lihat menu, dan nikmati setiap santapan bersama orang tersayang.
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-r from-orange-50 to-amber-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">Restoran Populer</h2>
            </div>
            <Link href="/restaurants" className="text-sm text-orange-500 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Lihat semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trendingLoading
              ? Array.from({ length: 6 }).map((_, i) => <RestaurantCardSkeleton key={i} />)
              : trending?.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
