import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Favorite } from '@/types';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useFavorites(userId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: QUERY_KEYS.FAVORITES_BY_USER(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('*, restaurants(*, categories(id, name, slug))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as unknown as Favorite[];
    },
    enabled: !!userId,
  });
}

export function useIsFavorite(userId: string, restaurantId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: QUERY_KEYS.FAVORITE_STATUS(userId, restaurantId),
    queryFn: async () => {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('restaurant_id', restaurantId)
        .single();
      return !!data;
    },
    enabled: !!userId && !!restaurantId,
  });
}

export function useToggleFavorite() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      restaurantId,
      isFavorite,
    }: {
      userId: string;
      restaurantId: string;
      isFavorite: boolean;
    }) => {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('restaurant_id', restaurantId);
        if (error) throw error;
        return { action: 'removed' as const };
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, restaurant_id: restaurantId } as any);
        if (error) throw error;
        return { action: 'added' as const };
      }
    },

    // Sprint 3: Optimistic update — ubah UI instan sebelum server merespons
    onMutate: async ({ userId, restaurantId, isFavorite }) => {
      const statusKey = QUERY_KEYS.FAVORITE_STATUS(userId, restaurantId);

      // Cancel outgoing refetch agar tidak overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: statusKey });

      // Simpan nilai lama untuk rollback jika error
      const previousStatus = queryClient.getQueryData<boolean>(statusKey);

      // Update cache langsung ke nilai baru (optimistic)
      queryClient.setQueryData<boolean>(statusKey, !isFavorite);

      return { previousStatus, statusKey };
    },

    // Rollback ke nilai semula jika mutation gagal
    onError: (_error, _variables, context) => {
      if (context?.statusKey !== undefined && context?.previousStatus !== undefined) {
        queryClient.setQueryData(context.statusKey, context.previousStatus);
      }
    },

    // Setelah selesai (berhasil atau gagal), sync ulang dengan server
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FAVORITE_STATUS(variables.userId, variables.restaurantId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FAVORITES_BY_USER(variables.userId),
      });
    },
  });
}