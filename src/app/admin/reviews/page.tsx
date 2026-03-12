'use client';

import { useAllReviews, useDeleteReview } from '@/hooks/useReviews';
import { useUIStore } from '@/store/uiStore';
import { StarRating } from '@/components/ui/StarRating';
import { Skeleton } from '@/components/ui/Skeleton';
import { Trash2, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Review } from '@/types';

type ReviewWithJoins = Review & {
  profiles?: { full_name: string | null; email: string };
  restaurants?: { name: string };
};

export default function AdminReviewsPage() {
  const { addToast, openConfirmModal } = useUIStore();
  const { data: reviews, isLoading } = useAllReviews();
  const { mutate: deleteReview } = useDeleteReview();

  const handleDelete = (review: ReviewWithJoins) => {
    openConfirmModal('Delete Review', 'Delete this review permanently?', () => {
      deleteReview(
        { id: review.id, restaurantId: review.restaurant_id },
        {
          onSuccess: () => addToast('success', 'Review deleted'),
          onError: () => addToast('error', 'Could not delete review'),
        }
      );
    });
  };

  const typedReviews = reviews as ReviewWithJoins[] | undefined;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Reviews</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      ) : typedReviews?.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <MessageSquare className="w-10 h-10 mx-auto mb-2" />
          <p>No reviews yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Restaurant</th>
                <th className="px-4 py-3 text-left">Comment</th>
                <th className="px-4 py-3 text-center">Rating</th>
                <th className="px-4 py-3 text-right hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {typedReviews?.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {review.profiles?.full_name || review.profiles?.email || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-400">{review.profiles?.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {review.restaurants?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs">
                    <p className="line-clamp-2">{review.comment || <em className="text-gray-400">No comment</em>}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-400 text-xs hidden lg:table-cell">
                    {formatDate(review.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(review)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
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
      )}
    </div>
  );
}
