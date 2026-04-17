import { supabase } from '../core/supabase';

const BUCKET = 'greenlabs-images';

/** Reject traversal segments and anything that isn't a-z 0-9 . - _ / (forward-slash allowed ONLY as folder separator). */
const SAFE_SEGMENT = /^[a-z0-9][a-z0-9._-]*$/i;

function sanitizeFolder(folder: string): string {
  if (!folder) throw new Error('folder is required');
  // Split on forward slash, validate each segment, reject traversal / absolute / control chars.
  const segments = folder.split('/').filter(Boolean);
  if (segments.length === 0) throw new Error('folder is empty after sanitize');
  for (const seg of segments) {
    if (seg === '..' || seg === '.' || !SAFE_SEGMENT.test(seg)) {
      throw new Error(`Invalid folder segment: "${seg}"`);
    }
  }
  return segments.join('/');
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-z0-9.]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^\.+/, '')
    .toLowerCase()
    .slice(0, 80) || 'image';
}

/**
 * Upload a file to Supabase Storage under `greenlabs-images/{folder}/`.
 * Returns the fully-qualified public URL.
 */
export async function uploadImage(folder: string, file: File | Blob): Promise<string> {
  const safeFolder = sanitizeFolder(folder);
  const name = file instanceof File ? file.name : 'image';
  const safeName = sanitizeFilename(name);
  const path = `${safeFolder}/${Date.now()}-${safeName}`;

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
 * Rejects paths containing `..`, leading `/`, backslashes, or empty segments so a caller
 * cannot coerce `deleteImage` into removing files outside the intended subtree.
 * Returns empty string if the URL doesn't match or the path fails validation.
 */
export function pathFromUrl(url: string): string {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return '';
  const raw = decodeURIComponent(url.slice(idx + marker.length));
  if (!raw || raw.startsWith('/') || raw.includes('\\')) return '';
  const segments = raw.split('/');
  for (const seg of segments) {
    if (!seg || seg === '..' || seg === '.') return '';
  }
  return raw;
}
