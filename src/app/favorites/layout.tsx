import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Favorites',
  description: 'View your saved favorite restaurants.',
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
