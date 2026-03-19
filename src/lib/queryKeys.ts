// src/lib/queryKeys.ts
// Sentralisasi semua query key untuk TanStack Query.
// WAJIB digunakan di semua hooks — jangan pernah gunakan string literal langsung.

export const QUERY_KEYS = {
  // Restaurants
  RESTAURANTS: 'restaurants',
  RESTAURANT_DETAIL: (id: string) => ['restaurants', id] as const,
  RESTAURANTS_TRENDING: ['restaurants', 'trending'] as const,
  RESTAURANTS_LIST: (filters: Record<string, unknown>) => ['restaurants', filters] as const,

  // Menus
  MENUS: 'menus',
  MENUS_BY_RESTAURANT: (restaurantId: string) => ['menus', restaurantId] as const,
  MENUS_ALL: ['menus', 'all'] as const,

  // Reviews
  REVIEWS: 'reviews',
  REVIEWS_BY_RESTAURANT: (restaurantId: string) => ['reviews', restaurantId] as const,
  REVIEWS_ALL: ['reviews', 'all'] as const,
  REVIEWS_BY_USER: (userId: string) => ['reviews', 'user', userId] as const,

  // Favorites
  FAVORITES: 'favorites',
  FAVORITES_BY_USER: (userId: string) => ['favorites', userId] as const,
  FAVORITE_STATUS: (userId: string, restaurantId: string) =>
    ['favorites', userId, restaurantId] as const,

  // Categories
  CATEGORIES: ['categories'] as const,

  // Admin
  ADMIN_STATS: ['admin', 'stats'] as const,
} as const;