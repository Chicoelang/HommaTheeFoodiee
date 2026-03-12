import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Restaurant, RestaurantFilters } from '@/types';

const RESTAURANTS_KEY = 'restaurants';

export function useRestaurants(filters: RestaurantFilters = {}) {
  const supabase = createClient();
  const { search, categoryId, location, sortBy = 'newest', page = 1, pageSize = 10 } = filters;

  return useQuery({
    queryKey: [RESTAURANTS_KEY, filters],
    queryFn: async () => {
      let query = supabase
        .from('restaurants')
        .select('*, categories(id, name, slug)', { count: 'exact' });

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      switch (sortBy) {
        case 'rating':
          query = query.order('avg_rating', { ascending: false });
          break;
        case 'most_reviewed':
          query = query.order('review_count', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        data: data as Restaurant[],
        total: count ?? 0,
        page,
        pageSize,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      };
    },
  });
}

export function useRestaurant(id: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: [RESTAURANTS_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*, categories(id, name, slug)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Restaurant;
    },
    enabled: !!id,
  });
}

export function useTrendingRestaurants() {
  const supabase = createClient();

  return useQuery({
    queryKey: [RESTAURANTS_KEY, 'trending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*, categories(id, name, slug)')
        .order('avg_rating', { ascending: false })
        .order('review_count', { ascending: false })
        .limit(6);
      if (error) throw error;
      return data as Restaurant[];
    },
  });
}

export function useCreateRestaurant() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (restaurant: Omit<Restaurant, 'id' | 'avg_rating' | 'review_count' | 'created_at' | 'categories'>) => {
      const { data, error } = await supabase
        .from('restaurants')
        .insert(restaurant as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESTAURANTS_KEY] });
    },
  });
}

export function useUpdateRestaurant() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Restaurant> & { id: string }) => {
      const { data, error } = await supabase
        .from('restaurants')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as Restaurant;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [RESTAURANTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [RESTAURANTS_KEY, data.id] });
    },
  });
}

export function useDeleteRestaurant() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('restaurants').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESTAURANTS_KEY] });
    },
  });
}
