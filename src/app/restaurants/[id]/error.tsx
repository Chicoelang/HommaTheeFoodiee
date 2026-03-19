// src/app/restaurants/[id]/error.tsx
'use client';

import { useEffect } from 'react';
import { UtensilsCrossed, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RestaurantDetailError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[RestaurantDetailError]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <UtensilsCrossed className="w-8 h-8 text-orange-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Restoran Tidak Ditemukan</h2>
        <p className="text-gray-500 text-sm mb-6">
          Gagal memuat detail restoran ini. Mungkin sudah dihapus atau terjadi gangguan jaringan.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
          <Link
            href="/restaurants"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>
      </div>
    </div>
  );
}