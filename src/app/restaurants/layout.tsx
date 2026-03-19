// src/app/restaurants/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Semua Restoran',
  description:
    'Jelajahi dan temukan restoran terbaik di kotamu. Filter berdasarkan kategori, rating, dan lokasi.',
  openGraph: {
    title: 'Semua Restoran — HoomaFoodie',
    description: 'Jelajahi ratusan restoran, baca ulasan, dan temukan tempat makan favoritmu.',
    type: 'website',
  },
};

export default function RestaurantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}