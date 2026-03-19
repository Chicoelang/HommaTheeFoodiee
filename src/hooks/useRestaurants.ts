import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Restaurant, RestaurantFilters } from '@/types';
import { QUERY_KEYS } from '@/lib/queryKeys';

// ─── Paginated list (dipakai di /restaurants page) ────────────────────────

export function useRestaurants(filters: RestaurantFilters = {}) {
  const supabase = createClient();
  const { search, categoryId, location, sortBy = 'newest', page = 1, pageSize = 10 } = filters;

  return useQuery({
    queryKey: QUERY_KEYS.RESTAURANTS_LIST(filters as Record<string, unknown>),
    queryFn: async () => {
      let query = supabase
        .from('restaurants')
        .select('*, categories(id, name, slug)', { count: 'exact' });

      if (search) query = query.ilike('name', `%${search}%`);
      if (categoryId) query = query.eq('category_id', categoryId);
      if (location) query = query.ilike('location', `%${location}%`);

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

// ─── Single restaurant detail ─────────────────────────────────────────────

export function useRestaurant(id: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: QUERY_KEYS.RESTAURANT_DETAIL(id),
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

// ─── Trending restaurants (dipakai di home page) ──────────────────────────

export function useTrendingRestaurants() {
  const supabase = createClient();

  return useQuery({
    queryKey: QUERY_KEYS.RESTAURANTS_TRENDING,
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

// ─── Sprint 3: Infinite scroll (opsional, untuk feed-style display) ───────
// Digunakan sebagai alternatif pagination. Contoh: LoadMoreRestaurants component.

export function useInfiniteRestaurants(
  filters: Omit<RestaurantFilters, 'page'> = {},
  pageSize: number = 12
) {
  const supabase = createClient();
  const { search, categoryId, location, sortBy = 'newest' } = filters;

  return useInfiniteQuery({
    queryKey: ['restaurants', 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      let query = supabase
        .from('restaurants')
        .select('*, categories(id, name, slug)', { count: 'exact' });

      if (search) query = query.ilike('name', `%${search}%`);
      if (categoryId) query = query.eq('category_id', categoryId);
      if (location) query = query.ilike('location', `%${location}%`);

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

      const from = ((pageParam as number) - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        data: data as Restaurant[],
        total: count ?? 0,
        page: pageParam as number,
        pageSize,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.page > 1) {
        return firstPage.page - 1;
      }
      return undefined;
    },
  });
}

// ─── CRUD mutations (dipakai di admin pages) ──────────────────────────────

export function useCreateRestaurant() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      restaurant: Omit<
        Restaurant,
        'id' | 'avg_rating' | 'review_count' | 'created_at' | 'categories'
      >
    ) => {
      const { data, error } = await supabase
        .from('restaurants')
        .insert(restaurant as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESTAURANTS] });
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESTAURANTS] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESTAURANT_DETAIL(data.id) });
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESTAURANTS] });
    },
  });
}