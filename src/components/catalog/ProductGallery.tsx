import { useState, useCallback, useEffect, useRef } from 'react';
import Modal from '../ui/Modal';
import '../../styles/components/product-gallery.css';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[activeIndex] : null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prevImage = useCallback(() => {
    setLightboxIndex(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImage = useCallback(() => {
    setLightboxIndex(i => (i + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, prevImage, nextImage]);

  // Touch swipe in lightbox
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) nextImage();
      else prevImage();
    }
    touchStartX.current = null;
  };

  if (!hasImages) {
    return (
      <div className="product-gallery product-gallery--empty">
        <div className="product-gallery__placeholder">
          <svg viewBox="0 0 200 200" fill="none" className="product-gallery__placeholder-svg" aria-hidden="true">
            <rect width="200" height="200" fill="#E8E0D2" />
            <ellipse cx="100" cy="135" rx="20" ry="8" fill="#B5C888" opacity="0.6" />
            <path d="M100 130 C100 130 85 110 80 90 C90 92 98 108 100 118 C102 108 110 92 120 90 C115 110 100 130 100 130 Z" fill="#8BA740" opacity="0.7" />
            <path d="M100 125 C100 125 72 105 62 78 C76 82 96 105 100 118 C104 105 124 82 138 78 C128 105 100 125 100 125 Z" fill="#6E8A2F" opacity="0.5" />
          </svg>
          <p className="product-gallery__no-image-text">Sin fotos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="product-gallery">
        {/* Thumbnail strip — vertical on desktop, horizontal on mobile */}
        {images.length > 1 && (
          <div className="product-gallery__thumbs">
            {images.map((img, i) => (
              <button
                key={img}
                className={`product-gallery__thumb-btn${i === activeIndex ? ' product-gallery__thumb-btn--active' : ''}`}
                onClick={() => setActiveIndex(i)}
                type="button"
                aria-label={`Ver foto ${i + 1}`}
              >
                <img
                  src={img}
                  alt={`${name} vista ${i + 1}`}
                  className="product-gallery__thumb-img"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div
          className="product-gallery__main"
          onClick={() => openLightbox(activeIndex)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && openLightbox(activeIndex)}
          aria-label="Ampliar imagen"
          title="Clic para ampliar"
        >
          <img
            src={currentImage!}
            alt={name}
            className="product-gallery__main-img"
          />
          <span className="product-gallery__zoom-hint" aria-hidden="true">
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="8" r="5" />
              <line x1="12" y1="12" x2="17" y2="17" />
              <line x1="8" y1="5" x2="8" y2="11" />
              <line x1="5" y1="8" x2="11" y2="8" />
            </svg>
          </span>
        </div>
      </div>

      {/* Lightbox */}
      <Modal isOpen={lightboxOpen} onClose={closeLightbox} labelledBy="lightbox-label">
        <div
          className="product-lightbox"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="product-lightbox__header">
            <span id="lightbox-label" className="product-lightbox__counter">
              {lightboxIndex + 1} / {images.length}
            </span>
            <button
              className="product-lightbox__close"
              onClick={closeLightbox}
              type="button"
              aria-label="Cerrar galería"
            >
              <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            </button>
          </div>

          <div className="product-lightbox__image-wrap">
            <img
              src={images[lightboxIndex]}
              alt={`${name} — foto ${lightboxIndex + 1}`}
              className="product-lightbox__image"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                className="product-lightbox__arrow product-lightbox__arrow--prev"
                onClick={prevImage}
                type="button"
                aria-label="Foto anterior"
              >
                <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="12 16 6 10 12 4" />
                </svg>
              </button>
              <button
                className="product-lightbox__arrow product-lightbox__arrow--next"
                onClick={nextImage}
                type="button"
                aria-label="Foto siguiente"
              >
                <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="8 4 14 10 8 16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
