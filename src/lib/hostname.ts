/**
 * Hostname-based routing helper.
 *
 * The site is served from two domains pointing at the same Cloudflare Pages build:
 *  - greenlabs.studio          → public storefront
 *  - admin.greenlabs.studio    → admin portal (login + /admin/* only)
 *
 * In local dev, the admin domain is simulated via `?admin=1` query OR by running
 * `localhost:5173` with the VITE_ADMIN_MODE env flag (less useful day-to-day).
 */
const PUBLIC_HOST = 'greenlabs.studio';
const ADMIN_HOST_PREFIX = 'admin.';

export function isAdminHost(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  if (host.startsWith(ADMIN_HOST_PREFIX)) return true;
  // Dev escape hatch so we can exercise both routers without two dev servers.
  if (host === 'localhost' || host === '127.0.0.1') {
    return new URLSearchParams(window.location.search).get('admin') === '1';
  }
  return false;
}

/** Rebuilds a URL at the customer-facing domain, preserving path + search. */
export function publicUrl(path: string = '/'): string {
  if (typeof window === 'undefined') return `https://${PUBLIC_HOST}${path}`;
  const { protocol } = window.location;
  const host = window.location.hostname.toLowerCase();
  // Local dev: stay on localhost, just strip ?admin=1
  if (host === 'localhost' || host === '127.0.0.1') {
    const url = new URL(path, window.location.origin);
    url.searchParams.delete('admin');
    return url.toString();
  }
  const base = host.startsWith(ADMIN_HOST_PREFIX)
    ? host.slice(ADMIN_HOST_PREFIX.length)
    : host;
  return `${protocol}//${base}${path}`;
}

/** Rebuilds a URL at the admin-facing domain, preserving path. */
export function adminUrl(path: string = '/'): string {
  if (typeof window === 'undefined') return `https://${ADMIN_HOST_PREFIX}${PUBLIC_HOST}${path}`;
  const { protocol } = window.location;
  const host = window.location.hostname.toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1') {
    const url = new URL(path, window.location.origin);
    url.searchParams.set('admin', '1');
    return url.toString();
  }
  const base = host.startsWith(ADMIN_HOST_PREFIX) ? host : `${ADMIN_HOST_PREFIX}${host}`;
  return `${protocol}//${base}${path}`;
}
