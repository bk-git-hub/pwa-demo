import { useMemo } from 'react';
import type { FeatureSupport } from '../types/feature';

export function useFeatureSupport(check: () => boolean): FeatureSupport {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return 'unknown';
    }

    return check() ? 'supported' : 'unsupported';
  }, [check]);
}
