import { Link } from 'react-router-dom';
import '../styles/pages/auth.css';
import '../styles/components/button.css';

/**
 * Public signup is intentionally disabled — Greenlabs runs on an invite-only
 * + guest-checkout model for now. This page shows a friendly "coming soon"
 * state so the route is still valid if someone lands here from an old link.
 */
export default function Signup() {
  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__badge">Próximamente</div>
        <h1 className="auth__title">Registro muy pronto</h1>
        <p className="auth__subtitle">
          Estamos preparando los perfiles de cliente para que puedas guardar tus
          favoritos, ver tus pedidos y recibir recordatorios de cuidado.
        </p>

        <p className="auth__hint">
          Mientras tanto puedes comprar como invitado — agrega tus suculentas al
          carrito y finaliza por WhatsApp sin crear cuenta.
        </p>

        <div className="auth__actions">
          <Link to="/catalogo" className="btn btn--primary btn--full btn--lg">
            Ver el catálogo
          </Link>
          <Link to="/auth/login" className="btn btn--ghost btn--full">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
