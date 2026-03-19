import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Review } from '@/types';
import { QUERY_KEYS } from '@/lib/queryKeys';

// ─── Reviews per restaurant (dipakai di halaman detail) ───────────────────

export function useReviews(restaurantId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: QUERY_KEYS.REVIEWS_BY_RESTAURANT(restaurantId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles!reviews_user_id_fkey(full_name, email)')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback: fetch reviews tanpa profile join jika foreign key belum ada
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

// ─── All reviews (dipakai di admin moderation) ────────────────────────────

export function useAllReviews() {
  const supabase = createClient();

  return useQuery({
    queryKey: QUERY_KEYS.REVIEWS_ALL,
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

// ─── Reviews per user (dipakai di profile page) ───────────────────────────

export function useUserReviews(userId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: QUERY_KEYS.REVIEWS_BY_USER(userId),
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

// ─── Create review (Sprint 3: optimistic update) ──────────────────────────

export function useCreateReview() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: {
      restaurant_id: string;
      user_id: string;
      rating: number;
      comment?: string;
    }) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert(review as any)
        .select('*, profiles!reviews_user_id_fkey(full_name, email)')
        .single();
      if (error) throw error;
      return data as unknown as Review & { restaurant_id: string; id: string };
    },

    // Optimistic update: tampilkan review baru di atas list segera
    onMutate: async (newReview) => {
      const reviewsKey = QUERY_KEYS.REVIEWS_BY_RESTAURANT(newReview.restaurant_id);

      // Cancel outgoing refetch agar tidak overwrite
      await queryClient.cancelQueries({ queryKey: reviewsKey });

      // Simpan nilai lama untuk rollback
      const previousReviews = queryClient.getQueryData<Review[]>(reviewsKey);

      // Buat review optimistic dengan id sementara
      const optimisticReview: Review = {
        id: `optimistic-${Date.now()}`,
        user_id: newReview.user_id,
        restaurant_id: newReview.restaurant_id,
        rating: newReview.rating,
        comment: newReview.comment ?? null,
        created_at: new Date().toISOString(),
        profiles: undefined,
      };

      // Prepend ke list (review terbaru di atas)
      queryClient.setQueryData<Review[]>(reviewsKey, (old) => [
        optimisticReview,
        ...(old ?? []),
      ]);

      return { previousReviews, reviewsKey };
    },

    // Rollback jika gagal
    onError: (_error, _variables, context) => {
      if (context?.reviewsKey && context?.previousReviews !== undefined) {
        queryClient.setQueryData(context.reviewsKey, context.previousReviews);
      }
    },

    // Sync dengan data asli dari server setelah berhasil
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REVIEWS_BY_RESTAURANT(data.restaurant_id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RESTAURANT_DETAIL(data.restaurant_id),
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RESTAURANTS],
      });
    },
  });
}

// ─── Delete review (Sprint 3: optimistic update) ──────────────────────────

export function useDeleteReview() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, restaurantId }: { id: string; restaurantId: string }) => {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      return { restaurantId, id };
    },

    // Optimistic: hapus dari list segera
    onMutate: async ({ id, restaurantId }) => {
      const reviewsKey = QUERY_KEYS.REVIEWS_BY_RESTAURANT(restaurantId);

      await queryClient.cancelQueries({ queryKey: reviewsKey });

      const previousReviews = queryClient.getQueryData<Review[]>(reviewsKey);

      // Filter out review yang dihapus
      queryClient.setQueryData<Review[]>(reviewsKey, (old) =>
        (old ?? []).filter((r) => r.id !== id)
      );

      return { previousReviews, reviewsKey };
    },

    // Rollback jika gagal
    onError: (_error, _variables, context) => {
      if (context?.reviewsKey && context?.previousReviews !== undefined) {
        queryClient.setQueryData(context.reviewsKey, context.previousReviews);
      }
    },

    // Sync dengan server setelah selesai
    onSettled: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RESTAURANT_DETAIL(data.restaurantId),
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RESTAURANTS],
      });
    },
  });
}