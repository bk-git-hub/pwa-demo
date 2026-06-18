export type FeatureSupport = 'supported' | 'unsupported' | 'unknown';

export type PermissionStateLabel = 'granted' | 'denied' | 'prompt' | 'unsupported' | 'unknown';

export type FeatureResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export type AsyncActionState<T> = {
  loading: boolean;
  result?: FeatureResult<T>;
};

export type FeatureTone = 'blue' | 'green' | 'orange' | 'red' | 'teal' | 'gray';
