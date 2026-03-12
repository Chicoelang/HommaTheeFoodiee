import Link from 'next/link';
import { ChefHat, Github, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Hooma<span className="text-orange-500">Foodie</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Temukan tempat makan terbaik di Kota Semarang. Baca ulasan, jelajahi menu, dan nikmati pengalaman kuliner yang tak terlupakan.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/restaurants', label: 'Restoran' },
                { href: '/favorites', label: 'Favorit' },
                { href: '/profile', label: 'Profil' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Ikuti Kami</h4>
            <div className="flex gap-3">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                  aria-label="Social media"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} HoomaFoodie. Kuliner Terbaik Kota Semarang.</p>
        </div>
      </div>
    </footer>
  );
}
