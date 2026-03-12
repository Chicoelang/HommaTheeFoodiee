'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  useRestaurants,
  useCreateRestaurant,
  useUpdateRestaurant,
  useDeleteRestaurant,
} from '@/hooks/useRestaurants';
import { useCategories } from '@/hooks/useCategories';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pencil, Trash2, Plus, UtensilsCrossed } from 'lucide-react';
import { Restaurant } from '@/types';

type FormData = {
  name: string;
  description: string;
  category_id: string;
  location: string;
  address: string;
  phone: string;
  opening_hours: string;
  image_url: string | null;
  latitude: string;
  longitude: string;
};

const emptyForm: FormData = {
  name: '',
  description: '',
  category_id: '',
  location: '',
  address: '',
  phone: '',
  opening_hours: '',
  image_url: null,
  latitude: '',
  longitude: '',
};

export default function AdminRestaurantsPage() {
  const { addToast, openConfirmModal } = useUIStore();
  const { data: result, isLoading } = useRestaurants({ pageSize: 100 });
  const { data: categories } = useCategories();
  const { mutate: create, isPending: creating } = useCreateRestaurant();
  const { mutate: update, isPending: updating } = useUpdateRestaurant();
  const { mutate: deleteRestaurant } = useDeleteRestaurant();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Restaurant | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (r: Restaurant) => {
    setEditing(r);
    setForm({
      name: r.name,
      description: r.description ?? '',
      category_id: r.category_id,
      location: r.location,
      address: r.address,
      phone: r.phone ?? '',
      opening_hours: r.opening_hours ?? '',
      image_url: r.image_url ?? null,
      latitude: r.latitude?.toString() ?? '',
      longitude: r.longitude?.toString() ?? '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description || null,
      category_id: form.category_id,
      location: form.location,
      address: form.address,
      phone: form.phone || null,
      opening_hours: form.opening_hours || null,
      image_url: form.image_url || null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
    };

    if (editing) {
      update(
        { id: editing.id, ...payload },
        {
          onSuccess: () => { addToast('success', 'Restaurant updated'); setIsModalOpen(false); },
          onError: (err: Error) => addToast('error', err.message),
        }
      );
    } else {
      create(payload as any, {
        onSuccess: () => { addToast('success', 'Restaurant created'); setIsModalOpen(false); },
        onError: (err: Error) => addToast('error', err.message),
      });
    }
  };

  const handleDelete = (r: Restaurant) => {
    openConfirmModal('Delete Restaurant', `Delete "${r.name}"? This cannot be undone.`, () => {
      deleteRestaurant(r.id, {
        onSuccess: () => addToast('success', 'Restaurant deleted'),
        onError: () => addToast('error', 'Could not delete restaurant'),
      });
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
        <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Add Restaurant
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </div>
      ) : result?.data.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <UtensilsCrossed className="w-10 h-10 mx-auto mb-2" />
          <p>No restaurants yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Restaurant</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Location</th>
                <th className="px-4 py-3 text-right">Rating</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {result?.data.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {r.image_url ? (
                          <Image src={r.image_url} alt={r.name} fill className="object-cover" unoptimized />
                        ) : (
                          <UtensilsCrossed className="w-5 h-5 text-gray-300 m-auto mt-2.5" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{r.categories?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{r.location}</td>
                  <td className="px-4 py-3 text-right text-gray-700 font-medium">
                    {r.avg_rating > 0 ? r.avg_rating.toFixed(1) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(r)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(r)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? 'Edit Restaurant' : 'Add Restaurant'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <ImageUpload
            bucket="restaurant-images"
            value={form.image_url}
            onChange={(url) => setForm((p) => ({ ...p, image_url: url }))}
          />
          <Input label="Name *" required {...f('name')} />
          <Textarea label="Description" {...f('description')} rows={2} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              required
              value={form.category_id}
              onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select category</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Location *" required {...f('location')} />
            <Input label="Phone" {...f('phone')} />
          </div>
          <Input label="Address *" required {...f('address')} />
          <Input label="Opening Hours" placeholder="e.g. Mon-Fri 08:00-22:00" {...f('opening_hours')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Latitude" type="number" step="any" {...f('latitude')} />
            <Input label="Longitude" type="number" step="any" {...f('longitude')} />
          </div>
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
