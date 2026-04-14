import { Link, useLocation } from 'react-router-dom';
import '../../styles/components/bottom-nav.css';

const navItems = [
  { id: 'home', path: '/', label: 'Inicio', paths: ['M3 12l9-8 9 8', 'M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9'] },
  { id: 'catalog', path: '/catalogo', label: 'Catálogo', paths: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M3 14h7v7H3z', 'M14 14h7v7h-7z'] },
  { id: 'services', path: '/servicios', label: 'Servicios', paths: ['M12 22V12', 'M12 12C12 12 7 10 4 6c5 0 8 2 8 6z', 'M12 12C12 12 17 10 20 6c-5 0-8 2-8 6z'] },
  { id: 'blog', path: '/blog', label: 'Blog', paths: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z'] },
  { id: 'profile', path: '/cuenta/perfil', label: 'Perfil', paths: ['M12 12a4 4 0 100-8 4 4 0 000 8z', 'M5 20c0-4 3.5-7 7-7s7 3 7 7'] },
];

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bottom-nav">
      {navItems.map(item => (
        <Link
          key={item.id}
          to={item.path}
          className={`bottom-nav__item ${isActive(item.path) ? 'bottom-nav__item--active' : ''}`}
        >
          <svg className="bottom-nav__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {item.paths.map((d, i) => <path key={i} d={d} />)}
          </svg>
          <span className="bottom-nav__label">{item.label}</span>
          {isActive(item.path) && <div className="bottom-nav__dot" />}
        </Link>
      ))}
    </div>
  );
}
