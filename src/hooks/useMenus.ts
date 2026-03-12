import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Menu } from '@/types';

const MENUS_KEY = 'menus';

export function useMenus(restaurantId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: [MENUS_KEY, restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('name');
      if (error) throw error;
      return data as Menu[];
    },
    enabled: !!restaurantId,
  });
}

export function useAllMenus() {
  const supabase = createClient();

  return useQuery({
    queryKey: [MENUS_KEY, 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menus')
        .select('*, restaurants(name)')
        .order('name');
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateMenu() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menu: Omit<Menu, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('menus').insert(menu as any).select().single();
      if (error) throw error;
      return data as unknown as Menu;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [MENUS_KEY, data.restaurant_id] });
      queryClient.invalidateQueries({ queryKey: [MENUS_KEY, 'all'] });
    },
  });
}

export function useUpdateMenu() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Menu> & { id: string }) => {
      const { data, error } = await supabase
        .from('menus')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as Menu;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [MENUS_KEY, data.restaurant_id] });
      queryClient.invalidateQueries({ queryKey: [MENUS_KEY, 'all'] });
    },
  });
}

export function useDeleteMenu() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, restaurantId }: { id: string; restaurantId: string }) => {
      const { error } = await supabase.from('menus').delete().eq('id', id);
      if (error) throw error;
      return { restaurantId };
    },
    onSuccess: ({ restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: [MENUS_KEY, restaurantId] });
      queryClient.invalidateQueries({ queryKey: [MENUS_KEY, 'all'] });
    },
  });
}
