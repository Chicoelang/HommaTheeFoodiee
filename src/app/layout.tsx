import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ToastContainer } from '@/components/providers/ToastContainer';
import { SiteShell } from '@/components/layout/SiteShell';

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'HoomaFoodie – Restaurant Directory',
    template: '%s | HoomaFoodie',
  },
  description:
    'Discover the best restaurants in your city. Read reviews, explore menus, and find your next favorite dining spot.',
  keywords: ['restaurant', 'food', 'dining', 'reviews', 'menu', 'culinary directory'],
  openGraph: {
    type: 'website',
    title: 'HoomaFoodie – Restaurant Directory',
    description: 'Discover the best restaurants in your city.',
    siteName: 'HoomaFoodie',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
