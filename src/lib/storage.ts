import { createClient } from '@/lib/supabase/client';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function uploadImage(
  file: File,
  bucket: 'restaurant-images' | 'menu-images'
): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be less than 5MB');
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP images are allowed');
  }

  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteImage(
  url: string,
  bucket: 'restaurant-images' | 'menu-images'
): Promise<void> {
  const supabase = createClient();
  const fileName = url.split('/').pop();
  if (!fileName) return;

  const { error } = await supabase.storage.from(bucket).remove([fileName]);
  if (error) throw error;
}
