'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Clock, Phone, Star, Heart, UtensilsCrossed, MessageSquare } from 'lucide-react';
import { useRestaurant } from '@/hooks/useRestaurants';
import { useMenus } from '@/hooks/useMenus';
import { useReviews, useCreateReview, useDeleteReview } from '@/hooks/useReviews';
import { useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { ReviewCard } from '@/components/restaurant/ReviewCard';
import { MenuCardSkeleton, ReviewSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/lib/utils';
import { Review } from '@/types';
import { cn } from '@/lib/utils';

export default function RestaurantDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuthStore();
  const { addToast, openConfirmModal } = useUIStore();

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews'>('menu');

  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(id);
  const { data: menus, isLoading: menusLoading } = useMenus(id);
  const { data: reviews, isLoading: reviewsLoading, isError: reviewsError } = useReviews(id);
  const { data: isFavorite } = useIsFavorite(user?.id ?? '', id);
  const { mutate: toggleFavorite, isPending: favoriteLoading } = useToggleFavorite();
  const { mutate: createReview, isPending: reviewSubmitting } = useCreateReview();
  const { mutate: deleteReview } = useDeleteReview();

  const handleFavorite = () => {
    if (!user) {
      addToast('info', 'Silakan masuk untuk menyimpan favorit');
      return;
    }
    toggleFavorite(
      { userId: user.id, restaurantId: id, isFavorite: !!isFavorite },
      {
        onSuccess: ({ action }) => addToast('success', action === 'added' ? 'Ditambahkan ke favorit!' : 'Dihapus dari favorit'),
        onError: () => addToast('error', 'Terjadi kesalahan'),
      }
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { addToast('info', 'Silakan masuk untuk menulis ulasan'); return; }
    if (reviewRating === 0) { addToast('warning', 'Silakan pilih rating terlebih dahulu'); return; }

    createReview(
      { restaurant_id: id, user_id: user.id, rating: reviewRating, comment: reviewComment },
      {
        onSuccess: () => {
          addToast('success', 'Ulasan berhasil dikirim!');
          setReviewRating(0);
          setReviewComment('');
          setActiveTab('reviews');
        },
        onError: (err: Error) => addToast('error', err.message || 'Gagal mengirim ulasan'),
      }
    );
  };

  const handleDeleteReview = (review: Review) => {
    openConfirmModal('Hapus Ulasan', 'Yakin ingin menghapus ulasan ini?', () => {
      deleteReview(
        { id: review.id, restaurantId: review.restaurant_id },
        {
          onSuccess: () => addToast('success', 'Ulasan dihapus'),
          onError: () => addToast('error', 'Gagal menghapus ulasan'),
        }
      );
    });
  };

  if (restaurantLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-20">
        <UtensilsCrossed className="w-14 h-14 text-gray-300 mx-auto mb-4" />
        <h2 className="text-gray-600 font-semibold text-lg">Restoran tidak ditemukan</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-gray-200">
        <Image
          src={restaurant.image_url ?? '/placeholder-restaurant.jpg'}
          alt={restaurant.name}
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="max-w-7xl mx-auto flex items-end justify-between gap-4">
            <div>
              {restaurant.categories && (
                <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full mb-3">
                  {restaurant.categories.name}
                </span>
              )}
              <h1 className="text-2xl sm:text-4xl font-bold text-white">{restaurant.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={restaurant.avg_rating} size="md" />
                <span className="text-white font-semibold">
                  {restaurant.avg_rating > 0 ? restaurant.avg_rating.toFixed(1) : 'Belum ada rating'}
                </span>
                <span className="text-white/70 text-sm">
                  ({restaurant.review_count} ulasan)
                </span>
              </div>
            </div>
            <button
              onClick={handleFavorite}
              disabled={favoriteLoading}
              className={cn(
                'flex-shrink-0 p-3 rounded-2xl backdrop-blur-sm transition-all',
                isFavorite ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              )}
              aria-label={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            >
              <Heart className={cn('w-6 h-6', isFavorite && 'fill-current')} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {restaurant.description && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-3">Tentang</h2>
                <p className="text-gray-600 leading-relaxed">{restaurant.description}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab('menu')}
                  className={cn(
                    'flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors',
                    activeTab === 'menu'
                      ? 'text-orange-600 border-b-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  Menu ({menus?.length ?? 0})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={cn(
                    'flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors',
                    activeTab === 'reviews'
                      ? 'text-orange-600 border-b-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <MessageSquare className="w-4 h-4" />
                  Ulasan ({restaurant.review_count})
                </button>
              </div>

              {/* Menu Tab */}
              {activeTab === 'menu' && (
                <div className="p-4 space-y-3">
                  {menusLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <MenuCardSkeleton key={i} />)
                  ) : menus?.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                      <UtensilsCrossed className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-sm">Belum ada menu tersedia</p>
                    </div>
                  ) : (
                    menus?.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 transition-colors">
                        {item.image_url && (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={item.image_url} alt={item.name} fill className="object-cover" unoptimized />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
                          )}
                          <p className="text-orange-500 font-bold text-sm mt-2">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="p-4">
                  {/* Write Review Form */}
                  {user ? (
                    <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-orange-50 rounded-xl space-y-3">
                      <h3 className="font-semibold text-gray-900 text-sm">Tulis Ulasan</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Rating kamu:</span>
                        <StarRating
                          rating={reviewRating}
                          size="lg"
                          interactive
                          onRatingChange={setReviewRating}
                        />
                      </div>
                      <Textarea
                        placeholder="Ceritakan pengalamanmu..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={3}
                      />
                      <Button type="submit" size="sm" isLoading={reviewSubmitting} disabled={reviewRating === 0}>
                        Kirim Ulasan
                      </Button>
                    </form>
                  ) : (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl text-center">
                      <p className="text-sm text-gray-600 mb-2">Masuk untuk menulis ulasan</p>
                      <a href="/login" className="text-orange-500 font-medium text-sm hover:underline">Masuk</a>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-3">
                    {reviewsLoading ? (
                      Array.from({ length: 3 }).map((_, i) => <ReviewSkeleton key={i} />)
                    ) : reviewsError ? (
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
                        <ReviewCard key={review.id} review={review} onDelete={handleDeleteReview} />
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-900">Info Restoran</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Alamat</p>
                    <p className="text-sm text-gray-700">{restaurant.address}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{restaurant.location}</p>
                  </div>
                </div>
                {restaurant.opening_hours && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Jam Buka</p>
                      <p className="text-sm text-gray-700">{restaurant.opening_hours}</p>
                    </div>
                  </div>
                )}
                {restaurant.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Telepon</p>
                      <a href={`tel:${restaurant.phone}`} className="text-sm text-orange-500 hover:underline">
                        {restaurant.phone}
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Star className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Rating</p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={restaurant.avg_rating} size="sm" />
                      <span className="text-sm font-semibold text-gray-900">
                        {restaurant.avg_rating > 0 ? restaurant.avg_rating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            {restaurant.address && (
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Lokasi</h3>
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-500" />
                  <span className="text-sm">{restaurant.address}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
