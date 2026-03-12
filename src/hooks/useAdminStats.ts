import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { AdminStats } from '@/types';

export function useAdminStats() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async (): Promise<AdminStats> => {
      const [restaurantsResult, categoriesResult, usersResult, reviewsResult] = await Promise.all([
        supabase.from('restaurants').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
      ]);

      return {
        totalRestaurants: restaurantsResult.count ?? 0,
        totalCategories: categoriesResult.count ?? 0,
        totalUsers: usersResult.count ?? 0,
        totalReviews: reviewsResult.count ?? 0,
      };
    },
  });
}
