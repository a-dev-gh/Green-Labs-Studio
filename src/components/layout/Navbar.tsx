import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../core/auth/useAuth';
import { useCart } from '../../core/cart/CartProvider';
import '../../styles/components/navbar.css';

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <Link to="/" className="navbar__brand">
        <img src="/logo-icon.webp" alt="GREENLABS" className="navbar__logo-img" />
        <span className="navbar__name">GREENLABS</span>
      </Link>

      <div className="navbar__links">
        <Link to="/" className="navbar__link">
          <svg className="navbar__link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12l9-8 9 8" />
            <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
          </svg>
          Inicio
        </Link>
        <span className="navbar__divider" />
        <Link to="/catalogo" className="navbar__link">
          <svg className="navbar__link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          Catálogo
        </Link>
        <span className="navbar__divider" />
        <Link to="/servicios" className="navbar__link">
          <svg className="navbar__link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22V12M12 12C12 12 7 10 4 6c5 0 8 2 8 6z" />
            <path d="M12 12C12 12 17 10 20 6c-5 0-8 2-8 6z" />
          </svg>
          Servicios
        </Link>
        <span className="navbar__divider" />
        <Link to="/nosotros" className="navbar__link">
          <svg className="navbar__link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
          </svg>
          Nosotros
        </Link>
        <span className="navbar__divider" />
        <Link to="/blog" className="navbar__link">
          <svg className="navbar__link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Blog
        </Link>
      </div>

      <div className="navbar__actions">
        {user ? (
          <Link to="/cuenta/perfil" className="navbar__action-btn" aria-label="Perfil">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
            </svg>
          </Link>
        ) : (
          <Link to="/auth/login" className="navbar__action-btn" aria-label="Iniciar sesión">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
            </svg>
          </Link>
        )}

        {isAdmin && (
          <Link to="/admin" className="navbar__action-btn navbar__action-btn--admin" aria-label="Admin">
            CMS
          </Link>
        )}

        <Link to="/carrito" className="navbar__cart-btn" aria-label="Carrito">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {itemCount > 0 && <span className="navbar__cart-badge">{itemCount}</span>}
        </Link>
      </div>
    </nav>
  );
}
