import { useState, useCallback } from 'react';

const STORAGE_KEY = 'app:displayName';

/**
 * Hook for persisting user display name in localStorage.
 * Fully client-side, no network calls.
 */
export function useDisplayName() {
  const [displayName, setDisplayName] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) ?? ''
  );

  const updateDisplayName = useCallback((name: string) => {
    const trimmed = name.trim();
    localStorage.setItem(STORAGE_KEY, trimmed);
    setDisplayName(trimmed);
  }, []);

  return { displayName, updateDisplayName } as const;
}
