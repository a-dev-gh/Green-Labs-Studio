import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { publicUrl } from '../lib/hostname';

/**
 * Rendered on admin.greenlabs.studio for any customer-facing route
 * (/, /catalogo, /servicios, etc.). Bounces the visitor to the same
 * path on the public domain so the admin subdomain stays admin-only.
 */
export default function AdminHostRedirect() {
  const location = useLocation();

  useEffect(() => {
    window.location.replace(publicUrl(location.pathname + location.search));
  }, [location]);

  return (
    <div className="page-loader">
      <div className="page-loader__spinner" />
    </div>
  );
}
