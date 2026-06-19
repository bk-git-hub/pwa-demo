import { useState } from 'react';
import { ApiCard } from '../../shared/components/ApiCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResultBox } from '../../shared/components/ResultBox';
import type { FeatureResult, PermissionStateLabel } from '../../shared/types/feature';
import type { ServiceWorkerUiState } from '../../pwa/registerServiceWorker';
import { NotificationPermissionHint } from './NotificationPermissionHint';
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
  const requestButtonLabel = permission === 'denied' ? '재요청 불가' : permission === 'unsupported' ? '미지원' : '권한 요청';

  const requestPermission = async () => {
    if (permission === 'denied') {
      setResult({
        ok: false,
        error: '이미 거부된 알림 권한은 웹 앱에서 다시 팝업으로 요청할 수 없습니다. 브라우저나 iOS 알림 설정에서 직접 허용해야 합니다.',
      });
      return;
    }

    const next = await requestNotificationPermission();
    if (next.ok && next.data) {
      setPermission(next.data);
    }
    if (next.ok && next.data === 'denied') {
      setResult({
        ok: false,
        error: '알림 권한이 거부되었습니다. 같은 권한 팝업을 다시 띄우려면 사용자가 브라우저나 iOS 알림 설정에서 직접 허용해야 합니다.',
      });
      return;
    }
    setResult(next);
  };

  const refreshPermission = () => {
    const next = currentNotificationPermission();
    setPermission(next);
    setResult({ ok: true, data: { permission: next, checkedAt: new Date().toISOString() } });
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
      <NotificationPermissionHint permission={permission} />
      <div className="actions">
        <PrimaryButton
          disabled={support === 'unsupported' || permission === 'granted' || permission === 'denied'}
          onClick={requestPermission}
        >
          {requestButtonLabel}
        </PrimaryButton>
        <PrimaryButton variant="secondary" onClick={refreshPermission}>
          권한 상태 다시 확인
        </PrimaryButton>
        <PrimaryButton disabled={permission !== 'granted'} variant="secondary" onClick={notify}>
          알림 표시
        </PrimaryButton>
      </div>
      <ResultBox result={result} title="알림 결과" />
    </ApiCard>
  );
}
