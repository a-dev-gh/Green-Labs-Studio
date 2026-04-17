import { useState, useEffect, useRef } from 'react';

/**
 * Counts from 0 to `target` over `durationMs` using easeOutCubic via rAF.
 * Returns the current integer value.
 * Respects prefers-reduced-motion — returns target immediately if set.
 */
export function useCountUp(target: number, durationMs = 1400): number {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [current, setCurrent] = useState(prefersReducedMotion ? target : 0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrent(target);
      return;
    }

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1);

      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      setCurrent(value);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  return current;
}
