import { useCallback, useState } from 'react';
import type { AsyncActionState, FeatureResult } from '../types/feature';

export function useAsyncAction<T>() {
  const [state, setState] = useState<AsyncActionState<T>>({ loading: false });

  const run = useCallback(async (action: () => Promise<FeatureResult<T>>) => {
    setState({ loading: true });
    const result = await action();
    setState({ loading: false, result });
    return result;
  }, []);

  const reset = useCallback(() => setState({ loading: false }), []);

  return { ...state, run, reset };
}
