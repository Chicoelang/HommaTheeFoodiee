// src/app/layout.tsx
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ToastContainer } from '@/components/providers/ToastContainer';
import { SiteShell } from '@/components/layout/SiteShell';

export const dynamic = 'force-dynamic';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'HoomaFoodie – Direktori Kuliner Semarang',
    template: '%s | HoomaFoodie',
  },
  description:
    'Temukan restoran terbaik di Semarang. Baca ulasan, jelajahi menu, dan nikmati pengalaman kuliner yang tak terlupakan.',
  keywords: ['restoran', 'kuliner', 'semarang', 'makanan', 'ulasan', 'menu', 'food directory'],
  openGraph: {
    type: 'website',
    title: 'HoomaFoodie – Direktori Kuliner Semarang',
    description: 'Temukan restoran terbaik di Semarang.',
    siteName: 'HoomaFoodie',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        <QueryProvider>
          <AuthProvider>
            <SiteShell>{children}</SiteShell>
            <ToastContainer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}