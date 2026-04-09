import { Outlet, NavLink } from 'react-router-dom';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/categorias', label: 'Categorías' },
  { to: '/admin/servicios', label: 'Servicios' },
  { to: '/admin/souvenirs', label: 'Souvenirs' },
  { to: '/admin/propuestas', label: 'Propuestas' },
  { to: '/admin/testimonios', label: 'Testimonios' },
  { to: '/admin/contenido', label: 'Contenido' },
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/usuarios', label: 'Usuarios' },
];

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <h2 className="admin-layout__title">Admin CMS</h2>
        <nav className="admin-layout__nav">
          {adminLinks.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end} className="admin-layout__link">
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="admin-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
