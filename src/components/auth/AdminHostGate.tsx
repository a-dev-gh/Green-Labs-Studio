import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../core/auth/useAuth';
import { publicUrl } from '../../lib/hostname';

/**
 * Gate rendered at the root of admin.greenlabs.studio routes.
 *  - Not logged in   → redirect to /auth/login (admin-branded login).
 *  - Logged in + admin → render the outlet (admin layout).
 *  - Logged in + NOT admin → auto-logout, show a friendly notice, then
 *    bounce to the public site after 3 s.
 */
export default function AdminHostGate() {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const [kicked, setKicked] = useState(false);

  useEffect(() => {
    if (!isLoading && user && !isAdmin && !kicked) {
      setKicked(true);
      // Fire and forget — logout doesn't need to block the UX.
      logout();
      const t = setTimeout(() => {
        window.location.replace(publicUrl('/'));
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [isLoading, user, isAdmin, kicked, logout]);

  if (isLoading) {
    return (
      <div className="page-loader">
        <div className="page-loader__spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="auth">
        <div className="auth__card">
          <div className="auth__badge auth__badge--admin">Acceso restringido</div>
          <h1 className="auth__title">Esta área es solo para administradores</h1>
          <p className="auth__subtitle">
            Te hemos cerrado la sesión por seguridad. Te redirigimos a la tienda…
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
