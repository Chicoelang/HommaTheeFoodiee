// src/app/profile/page.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useUserReviews, useDeleteReview } from '@/hooks/useReviews';
import { ReviewCard } from '@/components/restaurant/ReviewCard';
import { ReviewSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FadeUp, StaggerGrid, StaggerItem } from '@/components/providers/MotionProvider';
import {
  Shield, MessageSquare, Star, Calendar, Edit3, CheckCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Review } from '@/types';

// Palet warna avatar berdasarkan huruf pertama nama
const AVATAR_PALETTES = [
  { bg: 'from-orange-500 to-red-500', text: 'text-white', cover: 'from-orange-900/80 via-orange-700/60 to-amber-500/40' },
  { bg: 'from-blue-500 to-indigo-600', text: 'text-white', cover: 'from-blue-900/80 via-blue-700/60 to-indigo-500/40' },
  { bg: 'from-emerald-500 to-teal-600', text: 'text-white', cover: 'from-emerald-900/80 via-emerald-700/60 to-teal-500/40' },
  { bg: 'from-purple-500 to-violet-600', text: 'text-white', cover: 'from-purple-900/80 via-purple-700/60 to-violet-500/40' },
  { bg: 'from-pink-500 to-rose-600', text: 'text-white', cover: 'from-pink-900/80 via-pink-700/60 to-rose-500/40' },
  { bg: 'from-amber-500 to-orange-600', text: 'text-white', cover: 'from-amber-900/80 via-amber-700/60 to-orange-500/40' },
];

function getAvatarPalette(name: string) {
  const idx = (name.charCodeAt(0) ?? 0) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[idx];
}

function formatJoinDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ProfilePage() {
  const { user, profile, fetchProfile } = useAuthStore();
  const { addToast, openConfirmModal } = useUIStore();
  const supabase = createClient();

  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { data: reviews, isLoading: reviewsLoading } = useUserReviews(user?.id ?? '');
  const { mutate: deleteReview } = useDeleteReview();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);
    setSaving(false);
    if (error) {
      addToast('error', 'Gagal memperbarui profil');
    } else {
      await fetchProfile(user.id);
      addToast('success', 'Profil berhasil diperbarui!');
      setEditMode(false);
    }
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

  // Tidak login
  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState
          variant="no-profile"
          actionLabel="Masuk Sekarang"
          actionHref="/login"
        />
      </div>
    );
  }

  const displayName = profile.full_name || user.email?.split('@')[0] || 'Pengguna';
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0]?.toUpperCase() ?? '')
    .join('');
  const palette = getAvatarPalette(displayName);

  // Stats dari data
  const totalReviews = reviews?.length ?? 0;
  const avgRating =
    reviews && reviews.length > 0
      ? (
          reviews.reduce((sum: number, r: any) => sum + (r.rating ?? 0), 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── COVER BANNER ── */}
      <div
        className={`relative h-44 sm:h-52 bg-gradient-to-br from-gray-900 ${palette.cover} overflow-hidden`}
      >
        {/* Decorative bokeh */}
        <div className="absolute -top-10 right-10 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none" />
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Edit button */}
        <button
          onClick={() => setEditMode(!editMode)}
          className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 
                     backdrop-blur-sm border border-white/20 text-white text-xs font-semibold 
                     px-3 py-1.5 rounded-full transition-all duration-200"
        >
          <Edit3 className="w-3 h-3" />
          Edit Profil
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── PROFILE HEADER (avatar overlap banner) ── */}
        <div className="-mt-16 sm:-mt-20 mb-6 flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Avatar */}
          <div
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br ${palette.bg} 
                         flex items-center justify-center text-3xl sm:text-4xl font-extrabold 
                         ${palette.text} shadow-2xl border-4 border-white flex-shrink-0 select-none`}
          >
            {initials}
          </div>

          {/* Name + role */}
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {displayName}
              </h1>
              {profile.role === 'admin' && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 
                                 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm font-medium mt-0.5">{user.email}</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs">Bergabung {formatJoinDate(profile.created_at)}</span>
            </div>
          </div>
        </div>

        {/* ── STATS BAR ── */}
        <FadeUp className="grid grid-cols-3 gap-3 mb-8">
          {[
            {
              icon: MessageSquare,
              value: totalReviews.toString(),
              label: 'Ulasan Ditulis',
              color: 'text-orange-500',
              bg: 'bg-orange-50',
            },
            {
              icon: Star,
              value: avgRating ?? '—',
              label: 'Rata-rata Rating',
              color: 'text-amber-500',
              bg: 'bg-amber-50',
            },
            {
              icon: CheckCircle,
              value: profile.role === 'admin' ? 'Admin' : 'Member',
              label: 'Status Akun',
              color: profile.role === 'admin' ? 'text-purple-500' : 'text-emerald-500',
              bg: profile.role === 'admin' ? 'bg-purple-50' : 'bg-emerald-50',
            },
          ].map(({ icon: Icon, value, label, color, bg }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 
                         shadow-sm text-center hover:shadow-md transition-shadow"
            >
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                {value}
              </div>
              <div className="text-xs text-gray-400 font-medium mt-0.5">{label}</div>
            </div>
          ))}
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">

          {/* ── EDIT PROFILE FORM ── */}
          <div className="lg:col-span-1">
            <FadeUp className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-base">
                <Edit3 className="w-4 h-4 text-orange-500" />
                Edit Profil
              </h2>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <Input
                  label="Nama Lengkap"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama lengkap kamu"
                />
                <Input
                  label="Email"
                  value={user.email ?? ''}
                  disabled
                  className="bg-gray-50 cursor-not-allowed opacity-60"
                />
                <p className="text-xs text-gray-400">
                  Email tidak dapat diubah setelah akun dibuat.
                </p>
                <Button
                  type="submit"
                  isLoading={saving}
                  className="w-full"
                >
                  Simpan Perubahan
                </Button>
              </form>
            </FadeUp>
          </div>

          {/* ── MY REVIEWS ── */}
          <div className="lg:col-span-2">
            <FadeUp delay={0.08} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 flex items-center gap-2 text-base">
                  <MessageSquare className="w-4 h-4 text-orange-500" />
                  Ulasan Saya
                  {totalReviews > 0 && (
                    <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      {totalReviews}
                    </span>
                  )}
                </h2>
              </div>

              <div className="p-5">
                {reviewsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <ReviewSkeleton key={i} />
                    ))}
                  </div>
                ) : !reviews || reviews.length === 0 ? (
                  <EmptyState
                    variant="no-reviews"
                    description="Kamu belum menulis ulasan. Mulai bagikan pengalamanmu!"
                    actionLabel="Cari Restoran"
                    actionHref="/restaurants"
                    className="py-12"
                  />
                ) : (
                  <StaggerGrid className="space-y-3">
                    {reviews.map((review: any) => (
                      <StaggerItem key={review.id}>
                        <ReviewCard
                          review={review}
                          onDelete={handleDeleteReview}
                        />
                      </StaggerItem>
                    ))}
                  </StaggerGrid>
                )}
              </div>
            </FadeUp>
          </div>

        </div>
      </div>
    </div>
  );
}