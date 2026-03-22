// src/app/admin/menus/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAllMenus, useCreateMenu, useUpdateMenu, useDeleteMenu } from '../../../hooks/useMenus';
import { useRestaurants } from '../../../hooks/useRestaurants';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Skeleton } from '@/components/ui/Skeleton';
import { AdminFormField, AdminSelect } from '@/components/admin/AdminFormField';
import { Pencil, Trash2, Plus, BookOpen } from 'lucide-react';
import { Menu } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Pagination } from '@/components/ui/Pagination';

const menuSchema = z.object({
  restaurant_id: z.string().min(1, 'Restoran wajib dipilih'),
  name: z.string().min(1, 'Nama wajib diisi'),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, 'Harga wajib diisi')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Harga harus berupa angka positif'),
});

type FormValues = z.infer<typeof menuSchema>;

export default function AdminMenusPage() {
  const { addToast, openConfirmModal } = useUIStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Menu | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [filterRestaurant, setFilterRestaurant] = useState('');
  const [menuPage, setMenuPage] = useState(1);
  const MENU_PAGE_SIZE = 15;

  const { data: menusRaw, isLoading } = useAllMenus();
  // Ambil semua restoran untuk dropdown filter & form (ini wajar karena hanya untuk selector)
  const { data: restaurantsResult } = useRestaurants({ pageSize: 100 });
  const { mutate: create, isPending: creating } = useCreateMenu();
  const { mutate: update, isPending: updating } = useUpdateMenu();
  const { mutate: deleteMenu } = useDeleteMenu();

  type MenuWithRestaurant = Menu & { restaurants?: { name: string } };
  const menus = menusRaw as MenuWithRestaurant[] | undefined;

  // Client-side pagination setelah filter
  const filteredAll = filterRestaurant
    ? menus?.filter((m) => m.restaurant_id === filterRestaurant)
    : menus;
  const totalFiltered = filteredAll?.length ?? 0;
  const totalPages = Math.ceil(totalFiltered / MENU_PAGE_SIZE);
  const filteredMenus = filteredAll?.slice(
    (menuPage - 1) * MENU_PAGE_SIZE,
    menuPage * MENU_PAGE_SIZE
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(menuSchema) });

  const openCreate = () => {
    setEditing(null);
    setImageUrl(null);
    reset({ restaurant_id: '', name: '', description: '', price: '' });
    setIsModalOpen(true);
  };

  const openEdit = (m: Menu) => {
    setEditing(m);
    setImageUrl(m.image_url ?? null);
    reset({
      restaurant_id: m.restaurant_id,
      name: m.name,
      description: m.description ?? '',
      price: m.price.toString(),
    });
    setIsModalOpen(true);
  };

  const onSubmit = (values: FormValues) => {
    const payload = {
      restaurant_id: values.restaurant_id,
      name: values.name,
      description: values.description || null,
      price: parseFloat(values.price),
      image_url: imageUrl || null,
    };

    if (editing) {
      update(
        { id: editing.id, ...payload },
        {
          onSuccess: () => { addToast('success', 'Menu berhasil diperbarui'); setIsModalOpen(false); },
          onError: (err: Error) => addToast('error', err.message),
        }
      );
    } else {
      create(payload as any, {
        onSuccess: () => { addToast('success', 'Menu berhasil ditambahkan'); setIsModalOpen(false); },
        onError: (err: Error) => addToast('error', err.message),
      });
    }
  };

  const handleDelete = (m: Menu) => {
    openConfirmModal('Hapus Menu', `Hapus "${m.name}"?`, () => {
      deleteMenu(
        { id: m.id, restaurantId: m.restaurant_id },
        {
          onSuccess: () => addToast('success', 'Menu dihapus'),
          onError: () => addToast('error', 'Gagal menghapus menu'),
        }
      );
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menus</h1>
          {totalFiltered > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">Total {totalFiltered} item</p>
          )}
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Add Item
        </Button>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <AdminSelect
          value={filterRestaurant}
          onChange={(e) => { setFilterRestaurant(e.target.value); setMenuPage(1); }}
          className="max-w-xs"
        >
          <option value="">Semua Restoran</option>
          {restaurantsResult?.data.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </AdminSelect>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredMenus?.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BookOpen className="w-10 h-10 mx-auto mb-2" />
          <p>Belum ada menu</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Item</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Restoran</th>
                  <th className="px-4 py-3 text-right">Harga</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredMenus?.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {m.image_url ? (
                            <Image src={m.image_url} alt={m.name} fill className="object-cover" unoptimized />
                          ) : (
                            <BookOpen className="w-4 h-4 text-gray-300 m-auto mt-3" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{m.name}</div>
                          {m.description && (
                            <div className="text-xs text-gray-400 line-clamp-1">{m.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {m.restaurants?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatCurrency(m.price)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(m)}
                          className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(m)}
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

          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
              currentPage={menuPage}
              totalPages={totalPages}
              onPageChange={(page) => setMenuPage(page)}
            />
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? 'Edit Menu Item' : 'Add Menu Item'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <ImageUpload bucket="menu-images" value={imageUrl} onChange={setImageUrl} />

          <AdminFormField label="Restoran" required error={errors.restaurant_id?.message}>
            <AdminSelect error={!!errors.restaurant_id} {...register('restaurant_id')}>
              <option value="">Pilih restoran</option>
              {restaurantsResult?.data.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </AdminSelect>
          </AdminFormField>

          <AdminFormField label="Nama Item" required error={errors.name?.message}>
            <Input placeholder="Nama menu" {...register('name')} />
          </AdminFormField>

          <AdminFormField label="Deskripsi" error={errors.description?.message}>
            <Textarea placeholder="Deskripsi item..." rows={2} {...register('description')} />
          </AdminFormField>

          <AdminFormField label="Harga (IDR)" required error={errors.price?.message}>
            <Input type="number" min="0" step="any" placeholder="25000" {...register('price')} />
          </AdminFormField>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1" isLoading={creating || updating}>
              {editing ? 'Simpan Perubahan' : 'Tambah Menu'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}