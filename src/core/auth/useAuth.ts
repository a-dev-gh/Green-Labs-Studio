import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

/**
 * Hook to consume AuthContext.
 * Throws if used outside of <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an <AuthProvider>. ' +
      'Wrap your component tree with <AuthProvider> in App.tsx.'
    );
  }

  return context;
}
