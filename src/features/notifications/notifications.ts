import type { FeatureResult, FeatureSupport, PermissionStateLabel } from '../../shared/types/feature';

function mapNotificationPermission(permission: NotificationPermission): PermissionStateLabel {
  return permission === 'default' ? 'prompt' : permission;
}

export function notificationSupport(): FeatureSupport {
  return 'Notification' in window && 'serviceWorker' in navigator ? 'supported' : 'unsupported';
}

export function currentNotificationPermission(): PermissionStateLabel {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return mapNotificationPermission(Notification.permission);
}

export async function requestNotificationPermission(): Promise<FeatureResult<PermissionStateLabel>> {
  if (!('Notification' in window)) {
    return { ok: false, error: 'Notifications are not supported in this browser.' };
  }

  try {
    const permission = await Notification.requestPermission();
    return { ok: true, data: mapNotificationPermission(permission) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Notification request failed.' };
  }
}

export async function showLocalNotification(
  registration?: ServiceWorkerRegistration,
): Promise<FeatureResult<{ title: string; shownAt: string }>> {
  if (notificationSupport() === 'unsupported') {
    return { ok: false, error: 'Notifications require Notification and Service Worker support.' };
  }
  if (Notification.permission !== 'granted') {
    return { ok: false, error: 'Notification permission is not granted.' };
  }
  if (!registration?.showNotification) {
    return { ok: false, error: 'A registered service worker is required to show this notification.' };
  }

  const title = 'pwa-demo notification';
  await registration.showNotification(title, {
    body: 'This local notification was shown through the service worker registration.',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'pwa-demo-local',
  });

  return { ok: true, data: { title, shownAt: new Date().toISOString() } };
}
