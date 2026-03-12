import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurants',
  description: 'Browse all restaurants in our directory',
};

export default function RestaurantsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
