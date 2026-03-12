import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Review } from '@/types';

const REVIEWS_KEY = 'reviews';

export function useReviews(restaurantId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: [REVIEWS_KEY, restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles!reviews_user_id_fkey(full_name, email)')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });
      if (error) {
        // Fallback: fetch reviews without profile join
        const fallback = await supabase
          .from('reviews')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('created_at', { ascending: false });
        if (fallback.error) throw fallback.error;
        return (fallback.data ?? []) as Review[];
      }
      return (data ?? []) as Review[];
    },
    enabled: !!restaurantId,
  });
}

export function useAllReviews() {
  const supabase = createClient();

  return useQuery({
    queryKey: [REVIEWS_KEY, 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name, email), restaurants(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useUserReviews(userId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: [REVIEWS_KEY, 'user', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, restaurants(name, image_url)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useCreateReview() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: { restaurant_id: string; user_id: string; rating: number; comment?: string }) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert(review as any)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as { restaurant_id: string; id: string };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [REVIEWS_KEY, data.restaurant_id] });
      queryClient.invalidateQueries({ queryKey: ['restaurants', data.restaurant_id] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
}

export function useDeleteReview() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, restaurantId }: { id: string; restaurantId: string }) => {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      return { restaurantId };
    },
    onSuccess: ({ restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: [REVIEWS_KEY] });
      queryClient.invalidateQueries({ queryKey: ['restaurants', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
}
