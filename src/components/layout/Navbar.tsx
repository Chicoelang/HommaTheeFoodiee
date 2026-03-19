// src/components/layout/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChefHat, Heart, User, LogOut,
  LayoutDashboard, Menu, X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { motion, AnimatePresence } from '@/components/providers/MotionProvider';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/',            label: 'Beranda'   },
  { href: '/restaurants', label: 'Restoran'  },
];

const authLinks = [
  { href: '/favorites', label: 'Favorit', icon: Heart },
  { href: '/profile',   label: 'Profil',   icon: User  },
];

export function Navbar() {
  const pathname      = usePathname();
  const { user, profile, signOut } = useAuthStore();
  const { addToast }  = useUIStore();
  const [isScrolled,    setIsScrolled]    = useState(false);
  const [isMobileOpen,  setIsMobileOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsMobileOpen(false); }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    addToast('success', 'Berhasil keluar');
  };

  // ─── Animated logo icon ─────────────────────────────────────────────────────
  const LogoIcon = () => (
    <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="HoomaFoodie beranda">
      <motion.div
        whileHover={{
          scale: 1.12,
          rotate: [0, -8, 8, -4, 0],
          transition: { duration: 0.5, ease: 'easeInOut' },
        }}
        whileTap={{ scale: 0.93 }}
        className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 
                   rounded-xl flex items-center justify-center shadow-md shadow-orange-200/60
                   cursor-pointer"
      >
        <ChefHat className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
      </motion.div>
      <span className="font-extrabold text-[17px] text-gray-900 tracking-tight">
        Hooma<span className="text-orange-500">Foodie</span>
      </span>
    </Link>
  );

  // ─── Desktop nav link dengan animated underline ──────────────────────────────
  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={cn(
          'relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200',
          isActive
            ? 'text-orange-600'
            : 'text-gray-600 hover:text-gray-900'
        )}
      >
        {label}
        {/* Animated underline indicator */}
        {isActive && (
          <motion.div
            layoutId="nav-underline"
            className="absolute bottom-0 left-3 right-3 h-0.5 bg-orange-500 rounded-full"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        {/* Hover background */}
        <motion.div
          className="absolute inset-0 rounded-lg bg-orange-50 -z-10"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: isActive ? 0 : 1 }}
          transition={{ duration: 0.15 }}
        />
      </Link>
    );
  };

  return (
    <nav
      className={cn(
        'fixed top-0 inset-x-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-white/96 backdrop-blur-md shadow-sm border-b border-gray-100/80'
          : 'bg-white/85 backdrop-blur-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <LogoIcon />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5 relative">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {authLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                        isActive
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <link.icon className={cn('w-4 h-4', isActive && 'fill-orange-100 text-orange-500')} />
                      {link.label}
                    </Link>
                  );
                })}

                {profile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={cn(
                      'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                      pathname.startsWith('/admin')
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                  </Link>
                )}

                <div className="w-px h-5 bg-gray-200 mx-1" />

                {/* Avatar + name */}
                <div className="flex items-center gap-2.5 pl-1">
                  <div
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 
                               flex items-center justify-center flex-shrink-0 shadow-sm"
                  >
                    <span className="text-xs font-bold text-white select-none">
                      {profile?.full_name?.charAt(0).toUpperCase() ??
                       user.email?.charAt(0).toUpperCase() ?? 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hidden lg:block">
                    {profile?.full_name?.split(' ')[0] ?? 'Pengguna'}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold 
                             text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 
                             hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                >
                  Masuk
                </Link>
                <Link href="/register">
                  <motion.div
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-white 
                               bg-gradient-to-r from-orange-500 to-orange-600 
                               hover:from-orange-600 hover:to-red-500
                               shadow-md shadow-orange-200 transition-all duration-200 cursor-pointer"
                  >
                    Daftar
                  </motion.div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center
                       text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label={isMobileOpen ? 'Tutup menu' : 'Buka menu'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isMobileOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{   rotate:  90,  opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {isMobileOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-gray-100 bg-white/98 backdrop-blur-md"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                        isActive
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {user ? (
                <>
                  <div className="h-px bg-gray-100 my-2" />
                  {authLinks.map((link, i) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (i + 2) * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className={cn(
                            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                            isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                          )}
                        >
                          <link.icon className="w-4 h-4" />
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                  {profile?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dasbor Admin
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold 
                               text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2 pb-1">
                  <Link
                    href="/login"
                    className="flex-1 text-center py-2.5 border border-gray-200 rounded-xl 
                               text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 text-center py-2.5 bg-orange-500 rounded-xl 
                               text-sm font-bold text-white hover:bg-orange-600 transition-colors"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}