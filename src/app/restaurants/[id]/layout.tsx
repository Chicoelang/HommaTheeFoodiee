import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurant Details',
  description: 'View restaurant menu, reviews, and location.',
};

export default function RestaurantDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
