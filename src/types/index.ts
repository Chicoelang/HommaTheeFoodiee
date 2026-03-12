export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  category_id: string;
  location: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  opening_hours: string | null;
  image_url: string | null;
  avg_rating: number;
  review_count: number;
  created_at: string;
  categories?: Category;
}

export interface RestaurantWithCategory extends Restaurant {
  categories: Category;
}

export interface Menu {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  restaurant_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: Pick<Profile, 'full_name' | 'email'>;
}

export interface Favorite {
  id: string;
  user_id: string;
  restaurant_id: string;
  created_at: string;
  restaurants?: Restaurant;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface RestaurantFilters {
  search?: string;
  categoryId?: string;
  location?: string;
  sortBy?: 'rating' | 'newest' | 'most_reviewed';
  page?: number;
  pageSize?: number;
}

export interface AdminStats {
  totalRestaurants: number;
  totalCategories: number;
  totalUsers: number;
  totalReviews: number;
}
