import { useState, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/catalog/ProductCard';
import SearchBox from '../components/catalog/SearchBox';
import '../styles/pages/catalog.css';
import '../styles/components/product-card.css';
import '../styles/components/care-badges.css';
import '../styles/components/search-box.css';

const CATEGORY_PILLS = ['Todas', 'Echeveria', 'Kalanchoe', 'Crassula', 'Sedum'];

function SkeletonCard() {
  return (
    <div className="product-card product-card--skeleton" aria-hidden="true">
      <div className="product-card__image-wrap product-card__image-wrap--skeleton" />
      <div className="product-card__body">
        <div className="product-card__skeleton-line product-card__skeleton-line--sm" />
        <div className="product-card__skeleton-line product-card__skeleton-line--lg" />
        <div className="product-card__skeleton-line product-card__skeleton-line--md" />
      </div>
    </div>
  );
}

export default function Catalog() {
  const { items, isLoading, error, search } = useProducts();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');

  const filtered = useMemo(() => {
    let result = query ? search(query) : items;
    if (activeCategory !== 'Todas') {
      result = result.filter(p => p.category?.name === activeCategory);
    }
    return result;
  }, [items, query, activeCategory, search]);

  return (
    <div className="catalog">
      <h1 className="catalog__title">Catálogo</h1>
      <p className="catalog__subtitle">Suculentas seleccionadas con guía de cuidado incluida</p>

      {/* Search */}
      <div className="catalog__search">
        <SearchBox value={query} onChange={setQuery} />
      </div>

      {/* Category pills */}
      <div className="catalog__pills">
        {CATEGORY_PILLS.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`catalog__pill${activeCategory === cat ? ' catalog__pill--active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && !isLoading && (
        <div className="catalog__error">
          <p>No se pudo cargar el catálogo. Intenta de nuevo más tarde.</p>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="catalog__grid">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Grid */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="catalog__grid">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && filtered.length === 0 && items.length > 0 && (
        <div className="catalog__empty">
          <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="catalog__empty-icon">
            <circle cx="21" cy="21" r="14" />
            <line x1="32" y1="32" x2="44" y2="44" />
            <line x1="16" y1="21" x2="26" y2="21" />
          </svg>
          <p className="catalog__empty-title">Sin resultados</p>
          <p className="catalog__empty-text">
            No encontramos suculentas que coincidan con "{query || activeCategory}".
          </p>
          <button
            className="catalog__empty-reset"
            onClick={() => { setQuery(''); setActiveCategory('Todas'); }}
            type="button"
          >
            Ver todo el catálogo
          </button>
        </div>
      )}

      {/* Empty — no products at all */}
      {!isLoading && !error && items.length === 0 && (
        <div className="catalog__empty">
          <p className="catalog__empty-title">Catálogo en construcción</p>
          <p className="catalog__empty-text">Pronto tendremos suculentas disponibles.</p>
        </div>
      )}

      {/* ProductModal renders here as a nested route overlay */}
      <Outlet />
    </div>
  );
}
