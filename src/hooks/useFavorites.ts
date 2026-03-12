import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Favorite } from '@/types';

const FAVORITES_KEY = 'favorites';

export function useFavorites(userId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: [FAVORITES_KEY, userId],
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
    queryKey: [FAVORITES_KEY, userId, restaurantId],
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
    mutationFn: async ({ userId, restaurantId, isFavorite }: { userId: string; restaurantId: string; isFavorite: boolean }) => {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('restaurant_id', restaurantId);
        if (error) throw error;
        return { action: 'removed' };
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, restaurant_id: restaurantId } as any);
        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [FAVORITES_KEY, variables.userId] });
      queryClient.invalidateQueries({ queryKey: [FAVORITES_KEY, variables.userId, variables.restaurantId] });
    },
  });
}
