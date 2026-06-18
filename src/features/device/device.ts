import type { FeatureResult, FeatureSupport } from '../../shared/types/feature';

export type OrientationReading = {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
};

type DeviceOrientationConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<PermissionState>;
};

type WakeLockSentinelLike = EventTarget & {
  released: boolean;
  type: string;
  release: () => Promise<void>;
};

type NavigatorWithWakeLock = Navigator & {
  wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinelLike> };
  setAppBadge?: (contents?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
};

export function deviceSupport(): FeatureSupport {
  return 'DeviceOrientationEvent' in window || 'vibrate' in navigator || 'wakeLock' in navigator
    ? 'supported'
    : 'unsupported';
}

export async function requestOrientationPermission(): Promise<FeatureResult<PermissionState>> {
  const orientation = (window as Window & { DeviceOrientationEvent?: DeviceOrientationConstructor })
    .DeviceOrientationEvent;
  if (!orientation) {
    return { ok: false, error: 'Device orientation is not supported.' };
  }
  if (!orientation.requestPermission) {
    return { ok: true, data: 'granted' };
  }

  try {
    return { ok: true, data: await orientation.requestPermission() };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Orientation permission failed.' };
  }
}

export function subscribeOrientation(callback: (reading: OrientationReading) => void) {
  const listener = (event: DeviceOrientationEvent) => {
    callback({ alpha: event.alpha, beta: event.beta, gamma: event.gamma });
  };
  window.addEventListener('deviceorientation', listener);
  return () => window.removeEventListener('deviceorientation', listener);
}

export function vibrateDemo(): FeatureResult<{ vibrated: boolean }> {
  if (!navigator.vibrate) {
    return { ok: false, error: 'Vibration API is not supported here.' };
  }
  return { ok: true, data: { vibrated: navigator.vibrate([80, 40, 80]) } };
}

export async function requestWakeLock(): Promise<FeatureResult<WakeLockSentinelLike>> {
  const wakeLock = (navigator as NavigatorWithWakeLock).wakeLock;
  if (!wakeLock) {
    return { ok: false, error: 'Wake Lock API is not supported here.' };
  }

  try {
    return { ok: true, data: await wakeLock.request('screen') };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Wake lock request failed.' };
  }
}

export async function setDemoBadge(count: number): Promise<FeatureResult<{ count: number }>> {
  const nav = navigator as NavigatorWithWakeLock;
  if (!nav.setAppBadge) {
    return { ok: false, error: 'App Badging API is not supported here.' };
  }

  await nav.setAppBadge(count);
  return { ok: true, data: { count } };
}
