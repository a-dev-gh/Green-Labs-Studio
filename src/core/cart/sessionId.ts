const SESSION_KEY = 'greenlabs:guest_session_id';
const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/** Returns the current guest session id from localStorage, or null if absent / invalid / SSR. */
export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored && UUID_RE.test(stored)) return stored;
  } catch {
    // localStorage may be blocked (private browsing restrictions on some browsers)
  }
  return null;
}

/** Returns the existing guest session id, or creates and persists a new one. SSR-safe. */
export function getOrCreateSessionId(): string {
  const existing = getSessionId();
  if (existing) return existing;

  const id = crypto.randomUUID();
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SESSION_KEY, id);
    } catch {
      // Storage write failed — return the id in-memory only for this session
    }
  }
  return id;
}

/** Removes the guest session id from localStorage. */
export function clearSessionId(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}
