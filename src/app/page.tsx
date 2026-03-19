// src/app/page.tsx
'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, ChevronRight } from 'lucide-react';
import { useTrendingRestaurants } from '@/hooks/useRestaurants';
import { useCategories } from '@/hooks/useCategories';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/ui/Skeleton';
import {
  FadeUp,
  StaggerGrid,
  StaggerItem,
  motion,
} from '@/components/providers/MotionProvider';

const CATEGORY_ICONS: Record<string, string> = {
  cafe: '☕',
  'coffee-shop': '☕',
  'street-food': '🍜',
  'fast-food': '🍔',
  'family-restaurant': '🍽️',
  seafood: '🦐',
  dessert: '🍦',
  default: '🍴',
};

export default function HomePage() {
  const { data: trending, isLoading: trendingLoading } = useTrendingRestaurants();
  const { data: categories } = useCategories();

  return (
    <div className="min-h-screen">

      {/* ════════════════════════════════════════════
          HERO — cinematic dark food theme
      ════════════════════════════════════════════ */}
      <section className="relative min-h-[580px] flex items-center overflow-hidden bg-[#0f0500]">

        {/* Layered background bokeh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[600px] h-[600px] rounded-full bg-orange-600/20 blur-[120px] -top-32 -right-24" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-amber-500/15 blur-[100px] bottom-0 left-1/4" />
          <div className="absolute w-[300px] h-[300px] rounded-full bg-red-800/20 blur-[80px] top-1/2 -left-16" />
        </div>

        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating food decorations */}
        <div className="absolute right-8 top-16 text-7xl select-none pointer-events-none animate-float-slow opacity-70 hidden lg:block">
          🍜
        </div>
        <div className="absolute right-48 bottom-20 text-5xl select-none pointer-events-none animate-float-medium opacity-50 hidden lg:block">
          🥘
        </div>
        <div className="absolute right-20 top-1/2 text-4xl select-none pointer-events-none animate-float-fast opacity-40 hidden xl:block">
          🌶️
        </div>
        <div
          className="absolute right-80 top-12 text-6xl select-none pointer-events-none animate-float-slow opacity-35 hidden xl:block"
          style={{ animationDelay: '1.5s' }}
        >
          🍱
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-white/90 tracking-wide">
                250+ Restoran di Semarang
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-5"
            >
              Kuliner Semarang
              <br />
              <span className="text-gradient-orange">dalam Satu Tempat</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-white/65 leading-relaxed mb-8 max-w-lg"
            >
              Temukan restoran terbaik, baca ulasan jujur, dan nikmati setiap momen makan
              bersama orang tersayang.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/restaurants">
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-orange-500 to-orange-600
                             hover:from-orange-600 hover:to-red-500 text-white font-bold text-base
                             px-7 py-3.5 rounded-2xl shadow-xl shadow-orange-500/40
                             transition-all duration-200 cursor-pointer"
                >
                  Jelajahi Restoran
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
              <Link href="/restaurants?sortBy=rating">
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/18
                             border border-white/20 hover:border-white/35 text-white font-semibold
                             text-base px-7 py-3.5 rounded-2xl backdrop-blur-sm
                             transition-all duration-200 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                  Lihat Trending
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CATEGORY PILLS
      ════════════════════════════════════════════ */}
      {categories && categories.length > 0 && (
        <section className="bg-gray-50 py-10 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeUp className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Jelajahi Kategori
              </h2>
              <Link
                href="/restaurants"
                className="text-sm font-semibold text-orange-500 hover:text-orange-600
                           flex items-center gap-1 transition-colors"
              >
                Semua kategori
                <ChevronRight className="w-4 h-4" />
              </Link>
            </FadeUp>

            <div className="flex gap-3 flex-wrap">
              {/* "Semua" pill */}
              <FadeUp delay={0}>
                <Link href="/restaurants">
                  <motion.div
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 bg-orange-500 text-white
                               font-bold text-sm px-5 py-2.5 rounded-full shadow-md
                               shadow-orange-200 cursor-pointer transition-all"
                  >
                    🍴 Semua
                  </motion.div>
                </Link>
              </FadeUp>

              {categories.map((cat, i) => {
                const icon = CATEGORY_ICONS[cat.slug] ?? CATEGORY_ICONS.default;
                return (
                  <FadeUp key={cat.id} delay={0.05 + i * 0.04}>
                    <Link href={`/restaurants?categoryId=${cat.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        className="inline-flex items-center gap-2 bg-white hover:bg-orange-50
                                   border border-gray-200 hover:border-orange-300
                                   text-gray-700 hover:text-orange-600 font-semibold text-sm
                                   px-5 py-2.5 rounded-full shadow-sm cursor-pointer
                                   transition-all duration-200"
                      >
                        <span>{icon}</span>
                        {cat.name}
                      </motion.div>
                    </Link>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          TRENDING RESTAURANTS
      ════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500
                              flex items-center justify-center shadow-lg shadow-orange-200">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  Sedang Trending
                </h2>
                <p className="text-xs text-gray-400 font-medium">Rating & ulasan terbanyak</p>
              </div>
            </div>
            <Link
              href="/restaurants?sortBy=rating"
              className="group flex items-center gap-1.5 text-sm font-semibold text-orange-500
                         hover:text-orange-600 transition-colors"
            >
              Lihat semua
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </FadeUp>

          {trendingLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <RestaurantCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {trending?.map((restaurant) => (
                <StaggerItem key={restaurant.id}>
                  <RestaurantCard restaurant={restaurant} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </div>
      </section>

    </div>
  );
}