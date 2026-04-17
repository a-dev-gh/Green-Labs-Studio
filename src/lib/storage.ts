import { supabase } from '../core/supabase';

const BUCKET = 'greenlabs-images';

/**
 * Upload a file to Supabase Storage under `greenlabs-images/{folder}/`.
 * Returns the fully-qualified public URL.
 */
export async function uploadImage(folder: string, file: File | Blob): Promise<string> {
  const name = file instanceof File ? file.name : 'image';
  const safeName = name
    .replace(/[^a-z0-9.]/gi, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
  const path = `${folder}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: 'image/webp',
    upsert: false,
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Delete an image by its full public URL.
 */
export async function deleteImage(url: string): Promise<void> {
  const path = pathFromUrl(url);
  if (!path) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

/**
 * Extract the storage path (everything after `/greenlabs-images/`) from a full public URL.
 * Returns empty string if the URL doesn't match.
 */
export function pathFromUrl(url: string): string {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return '';
  return decodeURIComponent(url.slice(idx + marker.length));
}
