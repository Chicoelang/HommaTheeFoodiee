'use client';

import Link from 'next/link';
import { useAdminStats } from '../../hooks/useAdminStats';
import { Skeleton } from '@/components/ui/Skeleton';
import { UtensilsCrossed, Tag, Users, MessageSquare, ArrowUpRight, TrendingUp } from 'lucide-react';

const statCards = [
  {
    key: 'totalRestaurants',
    label: 'Total Restaurants',
    icon: UtensilsCrossed,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    iconBg: 'bg-orange-500',
    href: '/admin/restaurants',
    change: 'Manage listings',
  },
  {
    key: 'totalCategories',
    label: 'Categories',
    icon: Tag,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconBg: 'bg-blue-500',
    href: '/admin/categories',
    change: 'Manage categories',
  },
  {
    key: 'totalUsers',
    label: 'Registered Users',
    icon: Users,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-500',
    href: '#',
    change: 'Total members',
  },
  {
    key: 'totalReviews',
    label: 'Total Reviews',
    icon: MessageSquare,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    iconBg: 'bg-violet-500',
    href: '/admin/reviews',
    change: 'Manage reviews',
  },
] as const;

const quickActions = [
  { label: 'Add Restaurant', desc: 'List a new dining spot', href: '/admin/restaurants', icon: UtensilsCrossed, color: 'bg-orange-500' },
  { label: 'Add Category', desc: 'Create cuisine type', href: '/admin/categories', icon: Tag, color: 'bg-blue-500' },
  { label: 'Add Menu Item', desc: 'Add dishes to a restaurant', href: '/admin/menus', icon: TrendingUp, color: 'bg-emerald-500' },
  { label: 'Moderate Reviews', desc: 'Check pending reviews', href: '/admin/reviews', icon: MessageSquare, color: 'bg-violet-500' },
];

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map(({ key, label, icon: Icon, iconBg, href, change }) => (
          <div
            key={key}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              {href !== '#' && (
                <Link href={href} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mb-2" />
            ) : (
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {stats?.[key as keyof typeof stats] ?? 0}
              </p>
            )}
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map(({ label, desc, href, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex items-center gap-4"
            >
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-150`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-5 h-5" />
          <h2 className="font-bold text-lg">Welcome back, Admin!</h2>
        </div>
        <p className="text-orange-100 text-sm">
          Manage your HoomaFoodie platform from here. Add restaurants, curate categories, and keep the community thriving.
        </p>
      </div>
    </div>
  );
}
