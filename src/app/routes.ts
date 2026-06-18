export const FEATURE_ORDER = [
  'install',
  'offline',
  'camera',
  'gallery',
  'location',
  'notifications',
  'push',
  'clipboard',
  'share',
  'storage',
  'device',
] as const;

export type FeatureId = (typeof FEATURE_ORDER)[number];
