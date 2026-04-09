import { Outlet, NavLink } from 'react-router-dom';

export default function AccountLayout() {
  return (
    <div className="account-layout">
      <aside className="account-layout__sidebar">
        <h2 className="account-layout__title">Mi Cuenta</h2>
        <nav className="account-layout__nav">
          <NavLink to="/cuenta/perfil" className="account-layout__link">Perfil</NavLink>
          <NavLink to="/cuenta/pedidos" className="account-layout__link">Pedidos</NavLink>
          <NavLink to="/cuenta/listas" className="account-layout__link">Listas</NavLink>
          <NavLink to="/cuenta/configuracion" className="account-layout__link">Configuración</NavLink>
        </nav>
      </aside>
      <main className="account-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
