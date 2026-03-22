// src/app/admin/restaurants/page.tsx
'use client';

import { useState } from 'react';
import {
  Search, X, Pencil, Trash2, UtensilsCrossed,
  Loader2, AlertTriangle, Star, MapPin,
} from 'lucide-react';
import {
  useRestaurants,
  useUpdateRestaurant,
  useDeleteRestaurant,
} from '@/hooks/useRestaurants';
import { useCategories } from '@/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';
import { Restaurant } from '@/types';
import { cn } from '@/lib/utils';
import { Pagination } from '@/components/ui/Pagination';

const PAGE_SIZE = 10;

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({
  restaurant,
  categories,
  onClose,
}: {
  restaurant: Restaurant;
  categories: { id: string; name: string }[];
  onClose: () => void;
}) {
  const { mutate: update, isPending } = useUpdateRestaurant();

  const [form, setForm] = useState({
    name:          restaurant.name          ?? '',
    description:   restaurant.description   ?? '',
    address:       restaurant.address       ?? '',
    location:      restaurant.location      ?? '',
    phone:         restaurant.phone         ?? '',
    opening_hours: restaurant.opening_hours ?? '',
    image_url:     restaurant.image_url     ?? '',
    category_id:   restaurant.category_id   ?? '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    update({ id: restaurant.id, ...form }, { onSuccess: onClose });
  };

  const fields: {
    name: keyof typeof form;
    label: string;
    type?: string;
    multiline?: boolean;
  }[] = [
    { name: 'name',          label: 'Nama Restoran' },
    { name: 'description',   label: 'Deskripsi', multiline: true },
    { name: 'address',       label: 'Alamat Lengkap' },
    { name: 'location',      label: 'Area / Kawasan' },
    { name: 'phone',         label: 'Nomor Telepon', type: 'tel' },
    { name: 'opening_hours', label: 'Jam Buka (contoh: Mon-Sun 08:00-22:00)' },
    { name: 'image_url',     label: 'URL Gambar', type: 'url' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Edit Restoran</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">

          {/* Kategori */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Kategori
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Fields */}
          {fields.map(({ name, label, type = 'text', multiline }) => (
            <div key={name}>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                {label}
              </label>
              {multiline ? (
                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteModal({
  restaurant,
  onClose,
}: {
  restaurant: Restaurant;
  onClose: () => void;
}) {
  const { mutate: deleteRestaurant, isPending } = useDeleteRestaurant();

  const handleDelete = () => {
    deleteRestaurant(restaurant.id, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Hapus Restoran?</h2>
            <p className="text-xs text-gray-500 mt-0.5">Tindakan ini tidak bisa dibatalkan</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Kamu akan menghapus <span className="font-semibold text-gray-900">"{restaurant.name}"</span> beserta semua data terkait secara permanen.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminRestaurantsPage() {
  const [searchInput, setSearchInput]   = useState('');
  const [categoryId, setCategoryId]     = useState('');
  const [page, setPage]                 = useState(1);
  const [editTarget, setEditTarget]     = useState<Restaurant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Restaurant | null>(null);

  const debouncedSearch = useDebounce(searchInput, 400);
  const { data: categories } = useCategories();

  const { data, isLoading, isFetching } = useRestaurants({
    search: debouncedSearch,
    categoryId,
    sortBy: 'newest',
    page,
    pageSize: PAGE_SIZE,
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleCategoryChange = (id: string) => {
    setCategoryId(id);
    setPage(1);
  };

  return (
    <>
      {/* ── Modals ── */}
      {editTarget && (
        <EditModal
          restaurant={editTarget}
          categories={categories ?? []}
          onClose={() => setEditTarget(null)}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          restaurant={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Page wrapper — tidak pakai min-h-screen karena layout sudah handle ── */}
      <div className="flex flex-col h-full -m-8"> {/* negate layout padding */}

        {/* ── Sticky search bar ── */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Restaurants</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {data ? `${data.total} restoran terdaftar` : 'Memuat...'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Cari restoran..."
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              />
              {searchInput && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category filter */}
            <select
              value={categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-700 min-w-[160px]"
            >
              <option value="">Semua Kategori</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Table area ── */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <UtensilsCrossed className="w-12 h-12 mb-3 text-gray-300" />
              <p className="font-semibold text-gray-600">Restoran tidak ditemukan</p>
              <p className="text-sm mt-1">Coba ubah kata kunci atau filter kategori</p>
            </div>
          ) : (
            <div className={cn('transition-opacity', isFetching && !isLoading ? 'opacity-60' : 'opacity-100')}>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Restoran</th>
                      <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Kategori</th>
                      <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Lokasi</th>
                      <th className="text-center px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Rating</th>
                      <th className="text-right px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data?.data?.map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-orange-50/30 transition-colors"
                      >
                        {/* Nama */}
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900 line-clamp-1">{r.name}</p>
                          {r.description && (
                            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{r.description}</p>
                          )}
                        </td>

                        {/* Kategori */}
                        <td className="px-5 py-4 hidden md:table-cell">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">
                            {r.categories?.name ?? '-'}
                          </span>
                        </td>

                        {/* Lokasi */}
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="line-clamp-1">{r.location || '-'}</span>
                          </div>
                        </td>

                        {/* Rating */}
                        <td className="px-5 py-4 text-center hidden sm:table-cell">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-semibold text-gray-700">
                              {r.avg_rating > 0 ? r.avg_rating.toFixed(1) : 'N/A'}
                            </span>
                            <span className="text-xs text-gray-400">({r.review_count})</span>
                          </div>
                        </td>

                        {/* Aksi */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditTarget(r)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteTarget(r)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {(data?.totalPages ?? 1) > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={page}
                    totalPages={data?.totalPages ?? 1}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}