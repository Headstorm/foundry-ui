/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import { getGPUTier, TierResult } from 'detect-gpu';

export const usePerformanceInfo = (): TierResult => {
  const [tierResult, setTier] = useState<TierResult>({ tier: 2, type: 'BENCHMARK' });

  useEffect(() => {
    // causes a rerender
    getGPUTier().then(tier => setTier(tier));
  }, []);

  return tierResult;
};
