import { useState, useCallback } from 'react';

const STORAGE_KEY = 'onboarding:session:seen';

type TooltipKey = 'swipe' | 'skip' | 'journal';

/**
 * Manages first-session onboarding tooltips.
 * Tooltips appear once per key and never again.
 */
export function useOnboarding() {
  const [seenTooltips, setSeenTooltips] = useState<Set<TooltipKey>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored) as TooltipKey[]) : new Set();
    } catch {
      return new Set<TooltipKey>();
    }
  });

  const isFirstSession = seenTooltips.size === 0;

  const shouldShowTooltip = useCallback(
    (key: TooltipKey): boolean => !seenTooltips.has(key),
    [seenTooltips]
  );

  const markTooltipSeen = useCallback((key: TooltipKey) => {
    setSeenTooltips((prev) => {
      const next = new Set(prev);
      next.add(key);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    const all: TooltipKey[] = ['swipe', 'skip', 'journal'];
    const allSet = new Set(all);
    setSeenTooltips(allSet);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }, []);

  return {
    isFirstSession,
    shouldShowTooltip,
    markTooltipSeen,
    completeOnboarding,
  };
}
