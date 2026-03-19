// src/components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, UtensilsCrossed, Tag, BookOpen,
  MessageSquare, ArrowLeft, ChefHat, LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useAllReviews } from '@/hooks/useReviews';
import { motion, AnimatePresence } from '@/components/providers/MotionProvider';

// ─── Nav item types ──────────────────────────────────────────────────────────

interface NavItemConfig {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number | null;  // count badge (misalnya total reviews)
}

// ─── Single nav item ─────────────────────────────────────────────────────────

function SidebarNavItem({
  href,
  icon: Icon,
  label,
  badge,
  isActive,
}: NavItemConfig & { isActive: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold',
        'transition-all duration-200 overflow-hidden group',
        isActive
          ? 'bg-gray-800/80 text-white'
          : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
      )}
    >
      {/* Left accent border — animated */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="accent"
            layoutId="sidebar-active-accent"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 600, damping: 35 }}
            className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-orange-500 shadow-sm shadow-orange-500/50"
          />
        )}
      </AnimatePresence>

      {/* Icon */}
      <motion.div
        animate={isActive ? { scale: 1.05 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={cn(
          'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200',
          isActive
            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
            : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-gray-200'
        )}
      >
        <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
      </motion.div>

      {/* Label */}
      <span className="flex-1 truncate">{label}</span>

      {/* Badge — count indicator */}
      <AnimatePresence>
        {badge != null && badge > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className={cn(
              'min-w-[20px] h-5 rounded-full flex items-center justify-center',
              'text-[10px] font-extrabold px-1.5',
              isActive
                ? 'bg-orange-400/30 text-orange-200'
                : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
            )}
          >
            {badge > 99 ? '99+' : badge}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

// ─── Main sidebar ─────────────────────────────────────────────────────────────

export function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { profile, signOut } = useAuthStore();

  // Ambil total reviews untuk badge
  const { data: reviewsData } = useAllReviews();
  const totalReviews = Array.isArray(reviewsData) ? reviewsData.length : 0;

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const navItems: NavItemConfig[] = [
    { href: '/admin',              icon: LayoutDashboard, label: 'Dashboard'   },
    { href: '/admin/restaurants',  icon: UtensilsCrossed, label: 'Restaurants' },
    { href: '/admin/categories',   icon: Tag,             label: 'Categories'  },
    { href: '/admin/menus',        icon: BookOpen,        label: 'Menus'       },
    {
      href: '/admin/reviews',
      icon: MessageSquare,
      label: 'Reviews',
      badge: totalReviews,
    },
  ];

  const displayName = profile?.full_name ?? 'Admin';
  const initial     = displayName.charAt(0).toUpperCase();
  const email       = profile?.email ?? '';

  return (
    <aside className="w-64 min-h-screen bg-gray-950 flex flex-col flex-shrink-0 border-r border-white/5">

      {/* ── Logo ── */}
      <div className="px-5 py-5 border-b border-white/8">
        <Link href="/admin" className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 
                       flex items-center justify-center flex-shrink-0 
                       shadow-lg shadow-orange-500/25 cursor-pointer"
          >
            <ChefHat className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </motion.div>
          <div>
            <p className="font-extrabold text-white text-sm tracking-tight leading-tight">
              HoomaFoodie
            </p>
            <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-5">
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 mb-3">
          Menu
        </p>
        <div className="space-y-0.5">
          {navItems.map(({ href, icon, label, badge }) => {
            const isActive =
              href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
            return (
              <SidebarNavItem
                key={href}
                href={href}
                icon={icon}
                label={label}
                badge={badge}
                isActive={isActive}
              />
            );
          })}
        </div>
      </nav>

      {/* ── User footer ── */}
      <div className="px-3 py-4 border-t border-white/8 space-y-1">

        {/* User info card */}
        {profile && (
          <div className="flex items-center gap-3 px-3 py-3 mb-1 rounded-xl bg-white/3">
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 
                         flex items-center justify-center flex-shrink-0 shadow-sm"
            >
              <span className="text-xs font-extrabold text-white">{initial}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {displayName}
              </p>
              <p className="text-[10px] text-gray-500 truncate leading-tight">{email}</p>
            </div>
          </div>
        )}

        {/* Back to site */}
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold 
                     text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-all duration-150"
        >
          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          Kembali ke Situs
        </Link>

        {/* Sign out */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold 
                     text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
        >
          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
            <LogOut className="w-3.5 h-3.5" />
          </div>
          Keluar
        </motion.button>
      </div>
    </aside>
  );
}