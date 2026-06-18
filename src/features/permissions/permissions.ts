import type { PermissionStateLabel } from '../../shared/types/feature';

export type DemoPermissionName = 'camera' | 'geolocation' | 'notifications' | 'clipboard-write';

export async function queryPermission(name: DemoPermissionName): Promise<PermissionStateLabel> {
  if (!('permissions' in navigator) || !navigator.permissions?.query) {
    return 'unsupported';
  }

  try {
    const status = await navigator.permissions.query({ name: name as PermissionName });
    return status.state;
  } catch {
    return 'unsupported';
  }
}

export function notificationPermission(): PermissionStateLabel {
  if (!('Notification' in window)) {
    return 'unsupported';
  }

  return Notification.permission === 'default' ? 'prompt' : Notification.permission;
}
