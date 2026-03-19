// src/app/admin/reviews/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useAllReviews, useDeleteReview } from '../../../hooks/useReviews';
import { useUIStore } from '@/store/uiStore';
import { StarRating } from '@/components/ui/StarRating';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import { Trash2, MessageSquare, Search } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Review } from '@/types';

type ReviewWithJoins = Review & {
  profiles?: { full_name: string | null; email: string };
  restaurants?: { name: string };
};

const PAGE_SIZE = 15;

export default function AdminReviewsPage() {
  const { addToast, openConfirmModal } = useUIStore();
  const { data: reviews, isLoading } = useAllReviews();
  const { mutate: deleteReview } = useDeleteReview();
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | ''>('');
  const [page, setPage] = useState(1);

  const typedReviews = reviews as ReviewWithJoins[] | undefined;

  const filteredReviews = useMemo(() => {
    let result = typedReviews ?? [];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.restaurants?.name.toLowerCase().includes(q) ||
          r.profiles?.full_name?.toLowerCase().includes(q) ||
          r.comment?.toLowerCase().includes(q)
      );
    }
    if (ratingFilter !== '') {
      result = result.filter((r) => r.rating === ratingFilter);
    }
    return result;
  }, [typedReviews, search, ratingFilter]);

  const totalPages = Math.ceil(filteredReviews.length / PAGE_SIZE);
  const paginatedReviews = filteredReviews.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleDelete = (review: ReviewWithJoins) => {
    openConfirmModal('Hapus Ulasan', 'Hapus ulasan ini secara permanen?', () => {
      deleteReview(
        { id: review.id, restaurantId: review.restaurant_id },
        {
          onSuccess: () => addToast('success', 'Ulasan dihapus'),
          onError: () => addToast('error', 'Gagal menghapus ulasan'),
        }
      );
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          {!isLoading && (
            <p className="text-sm text-gray-500 mt-0.5">
              {filteredReviews.length} dari {typedReviews?.length ?? 0} ulasan
            </p>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari restoran, nama, atau komentar..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          />
        </div>
        <select
          value={ratingFilter}
          onChange={(e) => { setRatingFilter(e.target.value === '' ? '' : Number(e.target.value)); setPage(1); }}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value="">Semua Rating</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>⭐ {r} bintang</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : paginatedReviews.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <MessageSquare className="w-10 h-10 mx-auto mb-2" />
          <p>Tidak ada ulasan ditemukan</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Pengguna</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Restoran</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Komentar</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Tanggal</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedReviews.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-xs">
                        {r.profiles?.full_name ?? r.profiles?.email?.split('@')[0] ?? 'Anonim'}
                      </p>
                      <p className="text-gray-400 text-xs">{r.profiles?.email ?? '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {r.restaurants?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StarRating rating={r.rating} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell max-w-xs">
                      <p className="line-clamp-2 text-xs">{r.comment ?? '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                      {formatDate(r.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDelete(r)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Hapus ulasan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}