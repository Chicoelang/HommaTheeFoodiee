// src/app/restaurants/[id]/_components/ReviewTab.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { useCreateReview, useDeleteReview } from '../../../../hooks/useReviews';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { ReviewCard } from '@/components/restaurant/ReviewCard';
import { ReviewSkeleton } from '@/components/ui/Skeleton';
import { Review } from '@/types';

interface ReviewTabProps {
  restaurantId: string;
  reviews: Review[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function ReviewTab({ restaurantId, reviews, isLoading, isError }: ReviewTabProps) {
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
    createReview(
      { restaurant_id: restaurantId, user_id: user!.id, rating, comment },
      {
        onSuccess: () => {
          addToast('success', 'Ulasan berhasil dikirim!');
          setRating(0);
          setComment('');
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