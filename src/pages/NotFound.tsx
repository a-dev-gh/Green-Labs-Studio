import { Link } from 'react-router-dom';
import '../styles/pages/not-found.css';

export default function NotFound() {
  return (
    <div className="not-found">
      {/* Succulent silhouette illustration */}
      <div className="not-found__graphic" aria-hidden="true">
        <svg
          className="not-found__succulent"
          width="160"
          height="200"
          viewBox="0 0 160 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stem base */}
          <ellipse cx="80" cy="186" rx="20" ry="10" fill="#1B4332" opacity="0.25" />
          {/* Pot */}
          <path d="M60 170 Q60 192 80 192 Q100 192 100 170 L95 155 H65 Z" fill="#8BA740" opacity="0.55" />
          <rect x="58" y="150" width="44" height="10" rx="4" fill="#6E8A2F" opacity="0.5" />
          {/* Bottom leaves */}
          <path d="M80 148 Q55 110 38 120 Q30 140 55 140 Q70 140 80 148Z" fill="#1B4332" opacity="0.7" />
          <path d="M80 148 Q105 110 122 120 Q130 140 105 140 Q90 140 80 148Z" fill="#1B4332" opacity="0.7" />
          {/* Mid leaves */}
          <path d="M80 130 Q50 88 35 100 Q30 120 58 118 Q70 118 80 130Z" fill="#2D6A4F" opacity="0.75" />
          <path d="M80 130 Q110 88 125 100 Q130 120 102 118 Q90 118 80 130Z" fill="#2D6A4F" opacity="0.75" />
          {/* Top leaves */}
          <path d="M80 112 Q58 72 46 84 Q42 104 68 105 Q76 105 80 112Z" fill="#1B4332" opacity="0.85" />
          <path d="M80 112 Q102 72 114 84 Q118 104 92 105 Q84 105 80 112Z" fill="#1B4332" opacity="0.85" />
          {/* Center tip */}
          <path d="M80 112 Q72 80 80 60 Q88 80 80 112Z" fill="#8BA740" opacity="0.9" />
          {/* Flower bud */}
          <circle cx="80" cy="58" r="8" fill="#EF583D" opacity="0.8" />
          <circle cx="80" cy="58" r="4" fill="#F5F0E8" opacity="0.9" />
        </svg>
      </div>

      <div className="not-found__code">404</div>
      <h1 className="not-found__title">Página no encontrada</h1>
      <p className="not-found__text">
        Parece que esta suculenta se perdió en el camino.<br />
        La página que buscas no existe o fue movida.
      </p>

      <div className="not-found__actions">
        <Link to="/" className="not-found__btn not-found__btn--primary">
          Volver al inicio
        </Link>
        <Link to="/catalogo" className="not-found__btn not-found__btn--ghost">
          Ver catálogo
        </Link>
      </div>
    </div>
  );
}
