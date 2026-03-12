'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useUserReviews, useDeleteReview } from '@/hooks/useReviews';
import { ReviewCard } from '@/components/restaurant/ReviewCard';
import { ReviewSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Shield, MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Review } from '@/types';

export default function ProfilePage() {
  const { user, profile, fetchProfile } = useAuthStore();
  const { addToast, openConfirmModal } = useUIStore();
  const supabase = createClient();

  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [saving, setSaving] = useState(false);

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
    }
  };

  const handleDeleteReview = (review: Review) => {
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

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">Silakan masuk untuk melihat profil kamu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profil Saya</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">
                  {profile.full_name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? '?'}
                </span>
              </div>
              <h2 className="font-bold text-gray-900 text-lg">{profile.full_name || 'Pengguna'}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
              <span
                className={`inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                  profile.role === 'admin'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {profile.role === 'admin' && <Shield className="w-3 h-3" />}
                {profile.role === 'admin' ? 'Admin' : 'Anggota'}
              </span>
              <p className="text-xs text-gray-400 mt-3">
                Bergabung sejak {new Date(profile.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Edit Form + Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Edit Profil</h3>
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
                  className="bg-gray-50 cursor-not-allowed"
                />
                <Button type="submit" isLoading={saving}>
                  Simpan Perubahan
                </Button>
              </form>
            </div>

            {/* My Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-orange-500" />
                Ulasan Saya ({reviews?.length ?? 0})
              </h3>
              {reviewsLoading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <ReviewSkeleton key={i} />)}</div>
              ) : reviews?.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Kamu belum menulis ulasan</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews?.map((review) => (
                    <ReviewCard key={review.id} review={review} onDelete={handleDeleteReview} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
