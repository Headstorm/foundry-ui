import { useEffect, useState } from 'react';

/* eslint-disable import/prefer-default-export */
export const useReducedMotion = (defaultVal = true): boolean => {
  const [reducedMotion, setReducedMotion] = useState(defaultVal);

  const queryChangeHandler = (event: MediaQueryListEvent) => {
    setReducedMotion(event?.matches);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mediaQuery) {
      setReducedMotion(mediaQuery.matches);

      mediaQuery.addEventListener('change', queryChangeHandler);

      return () => mediaQuery.removeEventListener('change', queryChangeHandler);
    }
  }, []);

  return reducedMotion;
};
