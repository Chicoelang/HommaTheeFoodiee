// src/app/restaurants/error.tsx
'use client';

import { useEffect } from 'react';
import { UtensilsCrossed, RefreshCw } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RestaurantsError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[RestaurantsError]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <UtensilsCrossed className="w-8 h-8 text-orange-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Restoran</h2>
        <p className="text-gray-500 text-sm mb-6">
          Tidak dapat mengambil data restoran saat ini. Periksa koneksi internet kamu.
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors text-sm mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
      </div>
    </div>
  );
}