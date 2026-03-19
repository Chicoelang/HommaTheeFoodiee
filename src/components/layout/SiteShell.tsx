// src/components/layout/SiteShell.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PageTransition } from '@/components/providers/MotionProvider';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">
        <PageTransition key={pathname}>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}