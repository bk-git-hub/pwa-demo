import { useState } from 'react';
import { ApiCard } from '../../shared/components/ApiCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResultBox } from '../../shared/components/ResultBox';
import type { FeatureResult, PermissionStateLabel } from '../../shared/types/feature';
import type { ServiceWorkerUiState } from '../../pwa/registerServiceWorker';
import {
  currentNotificationPermission,
  notificationSupport,
  requestNotificationPermission,
  showLocalNotification,
} from './notifications';

type NotificationsCardProps = {
  serviceWorker: ServiceWorkerUiState;
};

export function NotificationsCard({ serviceWorker }: NotificationsCardProps) {
  const [permission, setPermission] = useState<PermissionStateLabel>(() => currentNotificationPermission());
  const [result, setResult] = useState<FeatureResult<unknown>>();
  const support = notificationSupport();

  const requestPermission = async () => {
    const next = await requestNotificationPermission();
    if (next.ok && next.data) {
      setPermission(next.data);
    }
    setResult(next);
  };

  const notify = async () => {
    const next = await showLocalNotification(serviceWorker.registration);
    setResult(next);
  };

  return (
    <ApiCard
      id="notifications"
      title="Notifications"
      description="Request permission from a user action and show a local notification through the service worker."
      support={support}
      permission={permission}
      note="Do not request notification permission on page load. Mobile, desktop, Android, and iOS behavior differs."
      tone="orange"
    >
      <div className="actions">
        <PrimaryButton disabled={support === 'unsupported'} onClick={requestPermission}>
          Request permission
        </PrimaryButton>
        <PrimaryButton disabled={permission !== 'granted'} variant="secondary" onClick={notify}>
          Show notification
        </PrimaryButton>
      </div>
      <ResultBox result={result} title="Notification result" />
    </ApiCard>
  );
}
