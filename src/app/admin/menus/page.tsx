'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  useAllMenus,
  useCreateMenu,
  useUpdateMenu,
  useDeleteMenu,
} from '@/hooks/useMenus';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pencil, Trash2, Plus, BookOpen } from 'lucide-react';
import { Menu } from '@/types';
import { formatCurrency } from '@/lib/utils';

type FormData = {
  restaurant_id: string;
  name: string;
  description: string;
  price: string;
  image_url: string | null;
};

const emptyForm: FormData = { restaurant_id: '', name: '', description: '', price: '', image_url: null };

export default function AdminMenusPage() {
  const { addToast, openConfirmModal } = useUIStore();
  const { data: menusRaw, isLoading } = useAllMenus();
  const { data: restaurantsResult } = useRestaurants({ pageSize: 100 });
  const { mutate: create, isPending: creating } = useCreateMenu();
  const { mutate: update, isPending: updating } = useUpdateMenu();
  const { mutate: deleteMenu } = useDeleteMenu();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Menu | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [filterRestaurant, setFilterRestaurant] = useState('');

  const menus = menusRaw as (Menu & { restaurants?: { name: string } })[] | undefined;
  const filteredMenus = filterRestaurant
    ? menus?.filter((m) => m.restaurant_id === filterRestaurant)
    : menus;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (m: Menu) => {
    setEditing(m);
    setForm({
      restaurant_id: m.restaurant_id,
      name: m.name,
      description: m.description ?? '',
      price: m.price.toString(),
      image_url: m.image_url ?? null,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      restaurant_id: form.restaurant_id,
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      image_url: form.image_url || null,
    };

    if (editing) {
      update(
        { id: editing.id, ...payload },
        {
          onSuccess: () => { addToast('success', 'Menu item updated'); setIsModalOpen(false); },
          onError: (err: Error) => addToast('error', err.message),
        }
      );
    } else {
      create(payload as any, {
        onSuccess: () => { addToast('success', 'Menu item created'); setIsModalOpen(false); },
        onError: (err: Error) => addToast('error', err.message),
      });
    }
  };

  const handleDelete = (m: Menu) => {
    openConfirmModal('Delete Menu Item', `Delete "${m.name}"?`, () => {
      deleteMenu(
        { id: m.id, restaurantId: m.restaurant_id },
        {
          onSuccess: () => addToast('success', 'Menu item deleted'),
          onError: () => addToast('error', 'Could not delete'),
        }
      );
    });
  };

  const f = (key: keyof FormData) => ({
    value: (form[key] ?? '') as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Menus</h1>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Add Item
        </Button>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filterRestaurant}
          onChange={(e) => setFilterRestaurant(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value="">All Restaurants</option>
          {restaurantsResult?.data.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </div>
      ) : filteredMenus?.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BookOpen className="w-10 h-10 mx-auto mb-2" />
          <p>No menu items</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Restaurant</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Actions</th>
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
                        {m.description && <div className="text-xs text-gray-400 line-clamp-1">{m.description}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{m.restaurants?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(m.price)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(m)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(m)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
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
        title={editing ? 'Edit Menu Item' : 'Add Menu Item'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <ImageUpload
            bucket="menu-images"
            value={form.image_url}
            onChange={(url) => setForm((p) => ({ ...p, image_url: url }))}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant *</label>
            <select
              required
              value={form.restaurant_id}
              onChange={(e) => setForm((p) => ({ ...p, restaurant_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select restaurant</option>
              {restaurantsResult?.data.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <Input label="Name *" required {...f('name')} />
          <Textarea label="Description" {...f('description')} rows={2} />
          <Input label="Price (IDR) *" type="number" required min="0" step="any" {...f('price')} />
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
