'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const pageLabels: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/restaurants': 'Restaurants',
  '/admin/categories': 'Categories',
  '/admin/menus': 'Menus',
  '/admin/reviews': 'Reviews',
};

export function AdminTopbar() {
  const pathname = usePathname();
  const { profile } = useAuthStore();

  const label = pageLabels[pathname] ?? 'Admin';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{label}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">
              {profile?.full_name?.charAt(0).toUpperCase() ?? 'A'}
            </span>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-800 leading-tight">{profile?.full_name ?? 'Admin'}</p>
            <p className="text-xs text-gray-400 leading-tight">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
