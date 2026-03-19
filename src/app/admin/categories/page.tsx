// src/app/admin/categories/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../../../hooks/useCategories';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { AdminFormField } from '@/components/admin/AdminFormField';
import { Pencil, Trash2, Plus, Tag } from 'lucide-react';
import { Category } from '@/types';
import { slugify } from '@/lib/utils';

const categorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
  slug: z
    .string()
    .min(1, 'Slug wajib diisi')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung'),
});

type FormValues = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const { addToast, openConfirmModal } = useUIStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const { data: categories, isLoading } = useCategories();
  const { mutate: create, isPending: creating } = useCreateCategory();
  const { mutate: update, isPending: updating } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(categorySchema) });

  const nameValue = watch('name');

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', slug: '' });
    setIsModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    reset({ name: c.name, slug: c.slug });
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue('name', name);
    // Auto-generate slug hanya saat create, bukan edit
    if (!editing) {
      setValue('slug', slugify(name));
    }
  };

  const onSubmit = (values: FormValues) => {
    if (editing) {
      update(
        { id: editing.id, ...values },
        {
          onSuccess: () => { addToast('success', 'Kategori berhasil diperbarui'); setIsModalOpen(false); },
          onError: (err: Error) => addToast('error', err.message),
        }
      );
    } else {
      create(values, {
        onSuccess: () => { addToast('success', 'Kategori berhasil ditambahkan'); setIsModalOpen(false); },
        onError: (err: Error) => addToast('error', err.message),
      });
    }
  };

  const handleDelete = (c: Category) => {
    openConfirmModal(
      'Hapus Kategori',
      `Hapus "${c.name}"? Restoran dalam kategori ini mungkin terpengaruh.`,
      () => {
        deleteCategory(c.id, {
          onSuccess: () => addToast('success', 'Kategori dihapus'),
          onError: () => addToast('error', 'Gagal menghapus kategori'),
        });
      }
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          {categories && (
            <p className="text-sm text-gray-500 mt-0.5">{categories.length} kategori</p>
          )}
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : categories?.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Tag className="w-10 h-10 mx-auto mb-2" />
          <p>Belum ada kategori</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Slug</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Dibuat</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories?.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Tag className="w-4 h-4 text-orange-500" />
                      </div>
                      <span className="font-medium text-gray-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                      {c.slug}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                    {new Date(c.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Hapus"
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AdminFormField label="Nama Kategori" required error={errors.name?.message}>
            <Input
              placeholder="Contoh: Fine Dining"
              {...register('name')}
              onChange={handleNameChange}
            />
          </AdminFormField>

          <AdminFormField
            label="Slug"
            required
            error={errors.slug?.message}
          >
            <Input
              placeholder="contoh: fine-dining"
              {...register('slug')}
            />
            <p className="text-xs text-gray-400 mt-1">
              Digunakan di URL. Hanya huruf kecil, angka, dan tanda hubung.
            </p>
          </AdminFormField>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1" isLoading={creating || updating}>
              {editing ? 'Simpan Perubahan' : 'Tambah Kategori'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}