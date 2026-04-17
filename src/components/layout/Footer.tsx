// src/components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import { ChefHat, Instagram, Twitter, Youtube, MapPin } from 'lucide-react';
import { motion } from '@/components/providers/MotionProvider';
import { cn } from '@/lib/utils';

const QUICK_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/restaurants', label: 'Restoran' },
  { href: '/favorites', label: 'Favorit Saya' },
  { href: '/profile', label: 'Profil' },
];

const CATEGORIES_LINKS = [
  { href: '/restaurants', label: 'Semua Restoran' },
  { href: '/restaurants?sortBy=rating', label: 'Rating Tertinggi' },
  { href: '/restaurants?sortBy=most_reviewed', label: 'Paling Populer' },
  { href: '/restaurants?sortBy=newest', label: 'Terbaru' },
];

const SOCIAL_LINKS = [
  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-500' },
  { icon: Twitter, href: '#', label: 'Twitter / X', color: 'hover:bg-sky-500' },
  { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:bg-red-500' },
];

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500
                              rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Hooma<span className="text-orange-400">Foodie</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 mb-5 max-w-xs">
              Direktori kuliner Semarang terlengkap. Temukan, ulasan, dan nikmati setiap pengalaman makan.
            </p>
            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
              <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span>Kota Semarang, Jawa Tengah</span>
            </div>

            {/* Social icons */}
            <div className="flex gap-2 mt-5">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label={label}
                  className={cn(
                    'w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center',
                    'text-gray-400 hover:text-white transition-all duration-200',
                    color
                  )}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide">Navigasi</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-orange-400
                               transition-colors duration-150 hover:translate-x-0.5
                               inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Restoran */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide">Restoran</h4>
            <ul className="space-y-2.5">
              {CATEGORIES_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-orange-400
                               transition-colors duration-150 hover:translate-x-0.5
                               inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide">Platform</h4>
            <ul className="space-y-2.5">
              {[
                'Tentang Kami',
                'Kebijakan Privasi',
                'Syarat & Ketentuan',
                'Hubungi Kami',
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-500 cursor-default hover:text-gray-400 transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800/80 pt-6 flex flex-col sm:flex-row
                        items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} HoomaFoodie. Semua hak dilindungi.
          </p>
          <p className="text-xs text-gray-700">
            Made with ❤️ for the people of Semarang
          </p>
        </div>
      </div>
    </footer>
  );
}