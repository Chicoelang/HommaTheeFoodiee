'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(i + 1) : undefined}
            className={cn(
              'relative',
              interactive && 'cursor-pointer hover:scale-110 transition-transform'
            )}
            aria-label={interactive ? `Rate ${i + 1} stars` : undefined}
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled
                  ? 'text-amber-400 fill-amber-400'
                  : partial
                  ? 'text-amber-400'
                  : 'text-gray-300 fill-gray-100'
              )}
            />
            {partial && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${(rating % 1) * 100}%` }}
              >
                <Star className={cn(sizeClasses[size], 'text-amber-400 fill-amber-400')} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
