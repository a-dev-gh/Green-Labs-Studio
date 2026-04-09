import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../core/auth/useAuth';

/**
 * Route guard: redirects unauthenticated visitors to /auth/login.
 * Shows a loading indicator while the auth state is being resolved.
 */
export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-loading" style={loadingStyles}>
        <div className="auth-loading__spinner" style={spinnerStyles} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}

/* ---------- Inline minimal styles (no Tailwind) ---------- */

const loadingStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
  fontFamily: 'var(--font-ui)',
};

const spinnerStyles: React.CSSProperties = {
  width: 36,
  height: 36,
  border: '3px solid var(--color-sand, #F5F0E8)',
  borderTopColor: 'var(--color-forest, #1B4332)',
  borderRadius: '50%',
  animation: 'auth-spin 0.7s linear infinite',
};

/* Inject keyframes once */
if (typeof document !== 'undefined') {
  const id = 'auth-spin-keyframes';
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `@keyframes auth-spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
  }
}
