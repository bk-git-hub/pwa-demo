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
    return { ok: false, error: '이 브라우저는 Notifications API를 지원하지 않습니다.' };
  }

  try {
    const permission = await Notification.requestPermission();
    return { ok: true, data: mapNotificationPermission(permission) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : '알림 권한 요청에 실패했습니다.' };
  }
}

export async function showLocalNotification(
  registration?: ServiceWorkerRegistration,
): Promise<FeatureResult<{ title: string; shownAt: string }>> {
  if (notificationSupport() === 'unsupported') {
    return { ok: false, error: '알림은 Notification과 Service Worker 지원이 모두 필요합니다.' };
  }
  if (Notification.permission !== 'granted') {
    return { ok: false, error: '알림 권한이 아직 허용되지 않았습니다.' };
  }
  if (!registration?.showNotification) {
    return { ok: false, error: '이 알림을 표시하려면 등록된 service worker가 필요합니다.' };
  }

  const title = 'pwa-demo 알림';
  await registration.showNotification(title, {
    body: '이 로컬 알림은 service worker registration을 통해 표시되었습니다.',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'pwa-demo-local',
  });

  return { ok: true, data: { title, shownAt: new Date().toISOString() } };
}
