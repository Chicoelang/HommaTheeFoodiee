// src/components/restaurant/ReviewCard.tsx
'use client';

import { useState } from 'react';
import { Review } from '@/types';
import { StarRating } from '@/components/ui/StarRating';
import { getRelativeTime } from '@/lib/utils';
import { Trash2, ThumbsUp } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from '@/components/providers/MotionProvider';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  review: Review;
  onDelete?: (review: Review) => void;
}

// Warna avatar dinamis berdasarkan nama
const AVATAR_COLORS = [
  'from-orange-500 to-red-500',
  'from-blue-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-purple-500 to-pink-500',
  'from-amber-500 to-orange-400',
  'from-cyan-500 to-blue-400',
];

function getAvatarColor(name: string): string {
  return AVATAR_COLORS[(name.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
}

export function ReviewCard({ review, onDelete }: ReviewCardProps) {
  const { user, isAdmin } = useAuthStore();
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteAnimating, setVoteAnimating] = useState(false);

  const canDelete = isAdmin() || user?.id === review.user_id;

  const displayName =
    review.profiles?.full_name ??
    review.profiles?.email?.split('@')[0] ??
    'Anonim';

  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0]?.toUpperCase() ?? '')
    .join('');

  const avatarGradient = getAvatarColor(displayName);

  const handleHelpful = () => {
    if (hasVoted) return;
    setVoteAnimating(true);
    setHasVoted(true);
    setHelpfulCount((c) => c + 1);
    setTimeout(() => setVoteAnimating(false), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm 
                 hover:shadow-md hover:border-orange-100 transition-all duration-200 space-y-3"
    >
      {/* ── Header: avatar + nama + rating + delete ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Avatar dengan warna dinamis */}
          <div
            className={cn(
              'w-10 h-10 rounded-full bg-gradient-to-br flex-shrink-0',
              'flex items-center justify-center text-sm font-bold text-white select-none',
              avatarGradient
            )}
          >
            {initials || '?'}
          </div>

          <div className="min-w-0">
            <p className="font-bold text-sm text-gray-900 leading-tight truncate">
              {displayName}
            </p>
            <p
              className="text-xs text-gray-400 mt-0.5"
              title={new Intl.DateTimeFormat('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }).format(new Date(review.created_at))}
            >
              {getRelativeTime(review.created_at)}
            </p>
          </div>
        </div>

        {/* Rating + delete */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-xs font-bold text-amber-700 ml-0.5">{review.rating}</span>
          </div>
          {canDelete && onDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(review)}
              className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 
                         rounded-lg transition-all duration-150"
              aria-label="Hapus ulasan"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Comment ── */}
      {review.comment && (
        <p className="text-sm text-gray-700 leading-relaxed pl-[52px]">
          {review.comment}
        </p>
      )}

      {/* ── Footer: helpful vote ── */}
      <div className="pl-[52px] flex items-center gap-3 pt-1">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleHelpful}
          disabled={hasVoted}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold',
            'border transition-all duration-200',
            hasVoted
              ? 'border-orange-200 bg-orange-50 text-orange-600 cursor-default'
              : 'border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50 cursor-pointer'
          )}
          aria-label="Tandai ulasan ini membantu"
        >
          <motion.div
            animate={voteAnimating ? { scale: [1, 1.5, 1], rotate: [0, -15, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <ThumbsUp className={cn('w-3.5 h-3.5', hasVoted && 'fill-current')} />
          </motion.div>
          <span>Membantu</span>
          <AnimatePresence mode="wait">
            {helpfulCount > 0 && (
              <motion.span
                key="count"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-orange-500 text-white text-[10px] font-bold 
                           w-4 h-4 rounded-full flex items-center justify-center"
              >
                {helpfulCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {hasVoted && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs text-gray-400 font-medium"
          >
            Terima kasih! 🙏
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}