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
      title="알림"
      description="사용자 클릭 이후 알림 권한을 요청하고, service worker를 통해 로컬 알림을 표시합니다."
      support={support}
      permission={permission}
      note="페이지 로드 시점에 알림 권한을 요청하지 마세요. 데스크톱, Android, iOS에서 동작이 다릅니다."
      tone="orange"
    >
      <div className="actions">
        <PrimaryButton disabled={support === 'unsupported'} onClick={requestPermission}>
          권한 요청
        </PrimaryButton>
        <PrimaryButton disabled={permission !== 'granted'} variant="secondary" onClick={notify}>
          알림 표시
        </PrimaryButton>
      </div>
      <ResultBox result={result} title="알림 결과" />
    </ApiCard>
  );
}
