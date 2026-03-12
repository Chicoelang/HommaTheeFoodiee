'use client';

import { useState } from 'react';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/useCategories';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pencil, Trash2, Plus, Tag } from 'lucide-react';
import { Category } from '@/types';
import { slugify } from '@/lib/utils';

type FormData = { name: string; slug: string };

export default function AdminCategoriesPage() {
  const { addToast, openConfirmModal } = useUIStore();
  const { data: categories, isLoading } = useCategories();
  const { mutate: create, isPending: creating } = useCreateCategory();
  const { mutate: update, isPending: updating } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormData>({ name: '', slug: '' });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', slug: '' });
    setIsModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug });
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => ({ name, slug: editing ? prev.slug : slugify(name) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(
        { id: editing.id, name: form.name, slug: form.slug },
        {
          onSuccess: () => { addToast('success', 'Category updated'); setIsModalOpen(false); },
          onError: (err: Error) => addToast('error', err.message),
        }
      );
    } else {
      create(
        { name: form.name, slug: form.slug },
        {
          onSuccess: () => { addToast('success', 'Category created'); setIsModalOpen(false); },
          onError: (err: Error) => addToast('error', err.message),
        }
      );
    }
  };

  const handleDelete = (c: Category) => {
    openConfirmModal('Delete Category', `Delete "${c.name}"? Restaurants in this category may be affected.`, () => {
      deleteCategory(c.id, {
        onSuccess: () => addToast('success', 'Category deleted'),
        onError: () => addToast('error', 'Could not delete category'),
      });
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
        </div>
      ) : categories?.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Tag className="w-10 h-10 mx-auto mb-2" />
          <p>No categories yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories?.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-orange-400" />
                      {c.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name *"
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
          <Input
            label="Slug *"
            required
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            placeholder="auto-generated"
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={creating || updating}>
              {editing ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
