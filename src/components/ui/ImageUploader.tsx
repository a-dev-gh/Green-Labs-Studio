import { useRef, useState, useCallback, useEffect } from 'react';
import { uploadImage, deleteImage } from '../../lib/storage';
import '../../styles/components/image-uploader.css';

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder: string;
  maxFiles?: number;
  maxBytesPerFile?: number;
  accept?: string;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  error?: string;
}

async function convertToWebp(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not available')); return; }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        blob => {
          URL.revokeObjectURL(url);
          if (blob) resolve(blob);
          else reject(new Error('Conversion failed'));
        },
        'image/webp',
        0.85
      );
    };

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

export default function ImageUploader({
  value,
  onChange,
  folder,
  maxFiles = 6,
  maxBytesPerFile = 2 * 1024 * 1024,
  accept = 'image/webp, image/jpeg, image/png',
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragSourceIndex = useRef<number | null>(null);

  const canAddMore = value.length + uploading.length < maxFiles;

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const available = maxFiles - value.length - uploading.length;
    const toProcess = fileArray.slice(0, Math.max(0, available));

    for (const file of toProcess) {
      if (file.size > maxBytesPerFile) {
        alert(`"${file.name}" excede el tamaño máximo de ${Math.round(maxBytesPerFile / 1024 / 1024)} MB.`);
        continue;
      }

      const id = crypto.randomUUID();
      setUploading(prev => [...prev, { id, name: file.name, progress: 0 }]);

      // Simulate incremental progress
      const timer = setInterval(() => {
        setUploading(prev =>
          prev.map(u => u.id === id && u.progress < 80 ? { ...u, progress: u.progress + 20 } : u)
        );
      }, 250);

      try {
        const blob = file.type === 'image/webp' ? file : await convertToWebp(file);
        const url = await uploadImage(folder, blob);

        clearInterval(timer);
        setUploading(prev => prev.filter(u => u.id !== id));
        onChange([...value, url]);
      } catch (err) {
        clearInterval(timer);
        const msg = err instanceof Error ? err.message : 'Error';
        setUploading(prev =>
          prev.map(u => u.id === id ? { ...u, progress: 0, error: msg } : u)
        );
        // Auto-clear error after 3s
        setTimeout(() => setUploading(prev => prev.filter(u => u.id !== id)), 3000);
      }
    }
  }, [folder, maxFiles, maxBytesPerFile, onChange, uploading.length, value]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (canAddMore && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [canAddMore, processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDelete = useCallback(async (url: string) => {
    try {
      await deleteImage(url);
    } catch {
      // Non-blocking — still remove from UI
    }
    onChange(value.filter(u => u !== url));
  }, [onChange, value]);

  // Drag-to-reorder
  const handleThumbDragStart = (index: number) => {
    dragSourceIndex.current = index;
  };

  const handleThumbDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleThumbDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const srcIdx = dragSourceIndex.current;
    if (srcIdx === null || srcIdx === targetIndex) {
      setDragOverIndex(null);
      dragSourceIndex.current = null;
      return;
    }
    const next = [...value];
    const [moved] = next.splice(srcIdx, 1);
    next.splice(targetIndex, 0, moved);
    onChange(next);
    setDragOverIndex(null);
    dragSourceIndex.current = null;
  };

  const handleThumbDragEnd = () => {
    setDragOverIndex(null);
    dragSourceIndex.current = null;
  };

  // Remove completed errors on unmount
  useEffect(() => {
    return () => setUploading([]);
  }, []);

  return (
    <div className="image-uploader">
      {/* Drop zone */}
      {canAddMore && (
        <div
          className={`image-uploader__zone${isDragging ? ' image-uploader__zone--active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
          aria-label="Subir imagen"
        >
          <svg className="image-uploader__zone-icon" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="image-uploader__zone-text">
            Arrastra fotos aquí <span>o haz clic para buscar</span>
          </p>
          <p className="image-uploader__zone-hint">
            WEBP, JPG, PNG — máx. {Math.round(maxBytesPerFile / 1024 / 1024)} MB por foto · hasta {maxFiles} fotos
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            className="image-uploader__input"
            onChange={e => e.target.files && processFiles(e.target.files)}
            tabIndex={-1}
          />
        </div>
      )}

      {/* Upload progress bars */}
      {uploading.length > 0 && (
        <div className="image-uploader__progress-list">
          {uploading.map(u => (
            <div key={u.id} className={`image-uploader__progress-item${u.error ? ' image-uploader__progress-item--error' : ''}`}>
              <span className="image-uploader__progress-name">{u.name}</span>
              {u.error ? (
                <span className="image-uploader__progress-error">{u.error}</span>
              ) : (
                <div className="image-uploader__progress-bar">
                  <div
                    className="image-uploader__progress-fill"
                    style={{ width: `${u.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded thumbnails */}
      {value.length > 0 && (
        <div className="image-uploader__thumbs">
          {value.map((url, i) => (
            <div
              key={url}
              className={`image-uploader__thumb${dragOverIndex === i ? ' image-uploader__thumb--drag-over' : ''}`}
              draggable
              onDragStart={() => handleThumbDragStart(i)}
              onDragOver={e => handleThumbDragOver(e, i)}
              onDrop={e => handleThumbDrop(e, i)}
              onDragEnd={handleThumbDragEnd}
            >
              <img src={url} alt={`Imagen ${i + 1}`} className="image-uploader__thumb-img" />
              <button
                className="image-uploader__thumb-delete"
                onClick={() => handleDelete(url)}
                type="button"
                aria-label="Eliminar imagen"
                title="Eliminar"
              >
                <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="4" x2="16" y2="16" />
                  <line x1="16" y1="4" x2="4" y2="16" />
                </svg>
              </button>
              <div className="image-uploader__thumb-drag-handle" title="Arrastrar para reordenar">
                <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
                  <rect x="4" y="4" width="2" height="2" rx="1" />
                  <rect x="9" y="4" width="2" height="2" rx="1" />
                  <rect x="14" y="4" width="2" height="2" rx="1" />
                  <rect x="4" y="9" width="2" height="2" rx="1" />
                  <rect x="9" y="9" width="2" height="2" rx="1" />
                  <rect x="14" y="9" width="2" height="2" rx="1" />
                  <rect x="4" y="14" width="2" height="2" rx="1" />
                  <rect x="9" y="14" width="2" height="2" rx="1" />
                  <rect x="14" y="14" width="2" height="2" rx="1" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
