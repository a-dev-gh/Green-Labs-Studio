import { useState, useCallback } from 'react';
import { uploadImage, deleteImage } from '../lib/storage';

interface UploadItem {
  id: string;
  name: string;
  progress: number; // 0-100
  url: string | null;
  error: string | null;
}

interface UseImageUploadResult {
  uploads: UploadItem[];
  upload: (folder: string, file: File | Blob, name?: string) => Promise<string | null>;
  remove: (url: string) => Promise<void>;
  clearCompleted: () => void;
}

export function useImageUpload(): UseImageUploadResult {
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const upload = useCallback(async (folder: string, file: File | Blob, name?: string): Promise<string | null> => {
    const id = crypto.randomUUID();
    const displayName = name ?? (file instanceof File ? file.name : 'image');

    setUploads(prev => [...prev, { id, name: displayName, progress: 0, url: null, error: null }]);

    // Simulate progress while upload runs (we don't have real progress events from Supabase SDK)
    const progressTimer = setInterval(() => {
      setUploads(prev =>
        prev.map(u =>
          u.id === id && u.progress < 85
            ? { ...u, progress: u.progress + 15 }
            : u
        )
      );
    }, 200);

    try {
      const url = await uploadImage(folder, file);
      clearInterval(progressTimer);
      setUploads(prev =>
        prev.map(u =>
          u.id === id ? { ...u, progress: 100, url } : u
        )
      );
      return url;
    } catch (err) {
      clearInterval(progressTimer);
      const message = err instanceof Error ? err.message : 'Error al subir imagen';
      setUploads(prev =>
        prev.map(u =>
          u.id === id ? { ...u, progress: 0, error: message } : u
        )
      );
      return null;
    }
  }, []);

  const remove = useCallback(async (url: string): Promise<void> => {
    await deleteImage(url);
  }, []);

  const clearCompleted = useCallback(() => {
    setUploads(prev => prev.filter(u => u.progress < 100 && !u.error));
  }, []);

  return { uploads, upload, remove, clearCompleted };
}
