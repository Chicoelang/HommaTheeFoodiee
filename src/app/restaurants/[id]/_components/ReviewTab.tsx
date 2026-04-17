// src/app/restaurants/[id]/_components/ReviewTab.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, UtensilsCrossed, X } from 'lucide-react';
import { useCreateReview, useDeleteReview } from '../../../../hooks/useReviews';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { ReviewCard } from '@/components/restaurant/ReviewCard';
import { ReviewSkeleton } from '@/components/ui/Skeleton';
import { Review, Menu } from '@/types';

interface ReviewTabProps {
  restaurantId: string;
  reviews: Review[] | undefined;
  isLoading: boolean;
  isError: boolean;
  selectedMenus?: Menu[];
  onRemoveSelectedMenu?: (menuId: string) => void;
  onClearSelectedMenus?: () => void;
}

export function ReviewTab({ restaurantId, reviews, isLoading, isError, selectedMenus = [], onRemoveSelectedMenu, onClearSelectedMenus }: ReviewTabProps) {
  const { user } = useAuthStore();
  const { addToast, openConfirmModal } = useUIStore();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { mutate: createReview, isPending: isSubmitting } = useCreateReview();
  const { mutate: deleteReview } = useDeleteReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      addToast('warning', 'Silakan pilih rating terlebih dahulu');
      return;
    }
    
    // Gabungkan info menu ke dalam komentar sebelum dikirim
    const finalComment = selectedMenus.length > 0 
      ? `Mengulas Menu: ${selectedMenus.map(m => m.name).join(', ')}\n\n${comment}`
      : comment;

    createReview(
      { restaurant_id: restaurantId, user_id: user!.id, rating, comment: finalComment },
      {
        onSuccess: () => {
          addToast('success', 'Ulasan berhasil dikirim!');
          setRating(0);
          setComment('');
          onClearSelectedMenus?.();
        },
        onError: () => addToast('error', 'Gagal mengirim ulasan'),
      }
    );
  };

  const handleDelete = (review: Review) => {
    openConfirmModal('Hapus Ulasan', 'Apakah kamu yakin ingin menghapus ulasan ini?', () => {
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
    <div className="p-4">
      {/* Form tulis ulasan */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-orange-50 rounded-xl space-y-3">
          <h3 className="font-semibold text-gray-900 text-sm">Tulis Ulasan</h3>
          
          {selectedMenus && selectedMenus.length > 0 && (
            <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-orange-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                  <span>Mengulas {selectedMenus.length} menu:</span>
                </div>
                <button 
                  type="button" 
                  onClick={onClearSelectedMenus}
                  className="text-xs text-gray-400 hover:text-red-500 font-medium"
                >
                  Hapus Semua
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedMenus.map((menu) => (
                  <span key={menu.id} className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {menu.name}
                    <button type="button" onClick={() => onRemoveSelectedMenu?.(menu.id)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rating kamu:</span>
            <StarRating
              rating={rating}
              size="lg"
              interactive
              onRatingChange={setRating}
            />
          </div>
          <Textarea
            placeholder="Ceritakan pengalamanmu di restoran ini..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <Button
            type="submit"
            size="sm"
            isLoading={isSubmitting}
            disabled={rating === 0}
          >
            Kirim Ulasan
          </Button>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-sm text-gray-600 mb-2">Masuk untuk menulis ulasan</p>
          <Link href="/login" className="text-orange-500 font-medium text-sm hover:underline">
            Masuk
          </Link>
        </div>
      )}

      {/* Daftar ulasan */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <ReviewSkeleton key={i} />)
        ) : isError ? (
          <div className="text-center py-8 text-red-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2" />
            <p className="text-sm">Gagal memuat ulasan. Coba refresh halaman.</p>
          </div>
        ) : !reviews || reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2" />
            <p className="text-sm">Belum ada ulasan. Jadilah yang pertama!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}