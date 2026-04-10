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
        <Link to="/catalogo" className="navbar__link">Catálogo</Link>
        <Link to="/servicios" className="navbar__link">Servicios</Link>
        <Link to="/blog" className="navbar__link">Blog</Link>
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
