// src/app/restaurants/[id]/layout.tsx
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

interface Props {
  params: Promise<{ id: string }>;
}

// generateMetadata berjalan di server — tidak perlu 'use client'
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('name, description, image_url, location, categories(name)')
      .eq('id', id)
      .single();

    if (!restaurant) {
      return {
        title: 'Restoran Tidak Ditemukan',
      };
    }

    const categoryName = (restaurant.categories as unknown as { name: string } | null)?.name;
    const title = restaurant.name;
    const description =
      restaurant.description ??
      `Temukan menu, ulasan, dan informasi ${restaurant.name}${categoryName ? ` — ${categoryName}` : ''} di ${restaurant.location}.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        ...(restaurant.image_url && {
          images: [
            {
              url: restaurant.image_url,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        }),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(restaurant.image_url && { images: [restaurant.image_url] }),
      },
    };
  } catch {
    return {
      title: 'Detail Restoran',
      description: 'Lihat menu, ulasan, dan informasi lengkap restoran.',
    };
  }
}

export default function RestaurantDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}