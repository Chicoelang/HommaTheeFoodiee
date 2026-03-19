// src/components/ui/Skeleton.tsx
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton-shimmer rounded-xl',
        className
      )}
    />
  );
}

export function RestaurantCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Image area */}
      <div className="skeleton-shimmer h-52 w-full" />
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="skeleton-shimmer h-5 w-3/4 rounded-lg" />
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="skeleton-shimmer h-4 w-24 rounded-lg" />
          <div className="skeleton-shimmer h-4 w-12 rounded-lg" />
        </div>
        {/* Location */}
        <div className="skeleton-shimmer h-3.5 w-2/3 rounded-lg" />
        {/* Tags */}
        <div className="flex gap-2">
          <div className="skeleton-shimmer h-6 w-20 rounded-full" />
          <div className="skeleton-shimmer h-6 w-16 rounded-full" />
        </div>
        {/* Button */}
        <div className="skeleton-shimmer h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function MenuCardSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-xl border border-gray-100">
      <div className="skeleton-shimmer w-24 h-24 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2.5 py-1">
        <div className="skeleton-shimmer h-4 w-3/4 rounded-lg" />
        <div className="skeleton-shimmer h-3 w-full rounded-lg" />
        <div className="skeleton-shimmer h-3 w-4/5 rounded-lg" />
        <div className="flex items-center justify-between mt-3">
          <div className="skeleton-shimmer h-5 w-24 rounded-lg" />
          <div className="skeleton-shimmer h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ReviewSkeleton() {
  return (
    <div className="p-5 rounded-xl border border-gray-100 space-y-3">
      <div className="flex items-center gap-3">
        <div className="skeleton-shimmer w-10 h-10 rounded-full flex-shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="skeleton-shimmer h-4 w-1/3 rounded-lg" />
          <div className="skeleton-shimmer h-3 w-1/4 rounded-lg" />
        </div>
        <div className="skeleton-shimmer h-4 w-20 rounded-lg" />
      </div>
      <div className="skeleton-shimmer h-3.5 w-full rounded-lg" />
      <div className="skeleton-shimmer h-3.5 w-4/5 rounded-lg" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="skeleton-shimmer min-h-[560px] w-full" />
  );
}