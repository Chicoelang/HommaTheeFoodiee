import { Review } from '@/types';
import { StarRating } from '@/components/ui/StarRating';
import { formatDate } from '@/lib/utils';
import { User, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface ReviewCardProps {
  review: Review;
  onDelete?: (review: Review) => void;
}

export function ReviewCard({ review, onDelete }: ReviewCardProps) {
  const { user, isAdmin } = useAuthStore();
  const canDelete = isAdmin() || user?.id === review.user_id;
  const displayName = review.profiles?.full_name ?? review.profiles?.email?.split('@')[0] ?? 'Anonim';

  return (
    <div className="p-5 bg-white rounded-xl border border-gray-100 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="font-medium text-sm text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-400">{formatDate(review.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} size="sm" />
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(review)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Hapus ulasan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}
