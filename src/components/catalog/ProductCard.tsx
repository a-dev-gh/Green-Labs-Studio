import { useNavigate } from 'react-router-dom';
import type { Product } from '../../lib/types';
import CareBadges from './CareBadges';
import '../../styles/components/product-card.css';

interface ProductCardProps {
  product: Product;
}

/** SVG placeholder shown when a product has no images */
function PlaceholderImage() {
  return (
    <svg
      className="product-card__placeholder-svg"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="200" height="200" fill="#E8E0D2" />
      {/* Simple succulent silhouette */}
      <ellipse cx="100" cy="135" rx="20" ry="8" fill="#B5C888" opacity="0.6" />
      <path d="M100 130 C100 130 85 110 80 90 C90 92 98 108 100 118 C102 108 110 92 120 90 C115 110 100 130 100 130 Z" fill="#8BA740" opacity="0.7" />
      <path d="M100 125 C100 125 72 105 62 78 C76 82 96 105 100 118 C104 105 124 82 138 78 C128 105 100 125 100 125 Z" fill="#6E8A2F" opacity="0.5" />
      <path d="M100 120 C100 120 90 100 88 80 C95 84 100 105 100 115 C100 105 105 84 112 80 C110 100 100 120 100 120 Z" fill="#A3BF5A" opacity="0.65" />
    </svg>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const firstImage = product.images?.[0];

  const handleClick = () => {
    navigate(`/catalogo/${product.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <article
      className="product-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Ver ${product.name}`}
    >
      <div className="product-card__image-wrap">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product.name}
            className="product-card__image"
            loading="lazy"
          />
        ) : (
          <PlaceholderImage />
        )}
        {product.is_featured && (
          <span className="product-card__badge">Destacada</span>
        )}
      </div>

      <div className="product-card__body">
        <div className="product-card__care">
          <CareBadges
            light_needs={product.light_needs}
            water_needs={product.water_needs}
            variant="compact"
          />
        </div>
        <h3 className="product-card__name">{product.name}</h3>
        {product.category?.name && (
          <p className="product-card__scientific">{product.category.name}</p>
        )}
        <div className="product-card__footer">
          <span className="product-card__price">RD$ {product.price.toLocaleString()}</span>
          {product.stock === 0 ? (
            <span className="product-card__out-of-stock">Agotado</span>
          ) : (
            <div className="product-card__add" aria-hidden="true">+</div>
          )}
        </div>
      </div>
    </article>
  );
}
