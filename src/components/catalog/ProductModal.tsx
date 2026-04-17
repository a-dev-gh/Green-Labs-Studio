import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import { useCart } from '../../core/cart/CartProvider';
import Modal from '../ui/Modal';
import ProductGallery from './ProductGallery';
import CareBadges from './CareBadges';
import '../../styles/components/product-modal.css';

export default function ProductModal() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { product, isLoading, error } = useProduct(slug);
  const { addItem } = useCart();

  const [careOpen, setCareOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClose = useCallback(() => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/catalogo');
  }, [navigate]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addItem(product.id);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
    }
  };

  return (
    <Modal isOpen onClose={handleClose} labelledBy="product-modal-title">
      <div className="product-modal">
        {/* Header with close button */}
        <div className="product-modal__header">
          <button
            className="product-modal__close"
            onClick={handleClose}
            type="button"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>
        </div>

        <div className="product-modal__body">
          {/* Loading skeleton */}
          {isLoading && (
            <div className="product-modal__skeleton">
              <div className="product-modal__skeleton-gallery" />
              <div className="product-modal__skeleton-info">
                <div className="product-modal__skeleton-line product-modal__skeleton-line--short" />
                <div className="product-modal__skeleton-line product-modal__skeleton-line--long" />
                <div className="product-modal__skeleton-line product-modal__skeleton-line--medium" />
              </div>
            </div>
          )}

          {/* Not found */}
          {!isLoading && (error || !product) && (
            <div className="product-modal__not-found">
              <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="product-modal__not-found-icon">
                <circle cx="24" cy="24" r="20" />
                <line x1="24" y1="15" x2="24" y2="25" />
                <circle cx="24" cy="33" r="1.5" fill="currentColor" />
              </svg>
              <p className="product-modal__not-found-title">Suculenta no encontrada</p>
              <p className="product-modal__not-found-text">
                Es posible que esta suculenta ya no esté disponible.
              </p>
              <button
                className="product-modal__not-found-link"
                onClick={() => navigate('/catalogo')}
                type="button"
              >
                Volver al catálogo
              </button>
            </div>
          )}

          {/* Product content */}
          {!isLoading && product && (
            <div className="product-modal__content">
              {/* Gallery — left/top */}
              <div className="product-modal__gallery">
                <ProductGallery images={product.images} name={product.name} />
              </div>

              {/* Info — right/bottom */}
              <div className="product-modal__info">
                {product.category?.name && (
                  <p className="product-modal__category">{product.category.name}</p>
                )}

                <h2 className="product-modal__name" id="product-modal-title">
                  {product.name}
                </h2>

                <CareBadges
                  light_needs={product.light_needs}
                  water_needs={product.water_needs}
                  variant="labeled"
                />

                <p className="product-modal__price">
                  RD$ {product.price.toLocaleString()}
                </p>

                {product.description && (
                  <p className="product-modal__description">{product.description}</p>
                )}

                {/* Care guide collapsible */}
                {product.care_guide && (
                  <div className="product-modal__care-guide">
                    <button
                      className="product-modal__care-toggle"
                      onClick={() => setCareOpen(o => !o)}
                      type="button"
                      aria-expanded={careOpen}
                    >
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" transform="scale(0.83333) translate(0, 0)" />
                      </svg>
                      Guía de cuidado
                      <svg
                        viewBox="0 0 20 20"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginLeft: 'auto', transform: careOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}
                      >
                        <polyline points="4 7 10 13 16 7" />
                      </svg>
                    </button>
                    {careOpen && (
                      <div className="product-modal__care-content">
                        <p>{product.care_guide}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="product-modal__actions">
                  <button
                    className={`product-modal__cart-btn${addedToCart ? ' product-modal__cart-btn--added' : ''}`}
                    onClick={handleAddToCart}
                    type="button"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0
                      ? 'Agotado'
                      : addedToCart
                        ? '¡Agregado!'
                        : 'Agregar al carrito'}
                  </button>
                  <button
                    className="product-modal__share-btn"
                    onClick={handleCopyLink}
                    type="button"
                    title="Copiar enlace"
                    aria-label="Copiar enlace del producto"
                  >
                    {copied ? (
                      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 10 8 14 16 6" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 12a4 4 0 006 0l3-3a4 4 0 00-6-6l-1.5 1.5" />
                        <path d="M12 8a4 4 0 00-6 0L3 11a4 4 0 006 6l1.5-1.5" />
                      </svg>
                    )}
                  </button>
                </div>

                {product.stock > 0 && product.stock <= 5 && (
                  <p className="product-modal__stock-low">
                    Solo {product.stock} unidades disponibles
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
