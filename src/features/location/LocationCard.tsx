import { useEffect, useState } from 'react';
import { ApiCard } from '../../shared/components/ApiCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResultBox } from '../../shared/components/ResultBox';
import type { PermissionStateLabel } from '../../shared/types/feature';
import { queryPermission } from '../permissions/permissions';
import {
  clearLocationWatch,
  getCurrentLocation,
  locationSupport,
  watchLocation,
  type LocationReading,
} from './location';

export function LocationCard() {
  const [permission, setPermission] = useState<PermissionStateLabel>('unknown');
  const [reading, setReading] = useState<LocationReading | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const support = locationSupport();

  useEffect(() => {
    void queryPermission('geolocation').then(setPermission);
    return () => clearLocationWatch(watchId);
  }, [watchId]);

  const getLocation = async () => {
    setLoading(true);
    setError(null);
    const result = await getCurrentLocation();
    setLoading(false);
    if (result.ok && result.data) {
      setReading(result.data);
      setPermission('granted');
      return;
    }
    setError(result.error ?? '위치 요청에 실패했습니다.');
    setPermission('denied');
  };

  const startWatch = () => {
    setError(null);
    const result = watchLocation(setReading, setError);
    if (result.ok && typeof result.data === 'number') {
      setWatchId(result.data);
      setPermission('granted');
    } else {
      setError(result.error ?? '위치 추적을 시작할 수 없습니다.');
    }
  };

  const stopWatch = () => {
    clearLocationWatch(watchId);
    setWatchId(null);
  };

  return (
    <ApiCard
      id="location"
      title="위치 / GPS"
      description="현재 좌표를 요청하고, 선택적으로 실시간 위치 변화를 watchPosition으로 확인합니다."
      support={support}
      permission={permission}
      note="localhost를 제외하면 HTTPS가 필요합니다. 브라우저 설정이나 Permissions Policy가 접근을 막을 수 있습니다."
      tone="green"
    >
      <div className="actions">
        <PrimaryButton disabled={support === 'unsupported' || loading} onClick={getLocation}>
          {loading ? '위치 확인 중...' : '현재 위치 가져오기'}
        </PrimaryButton>
        <PrimaryButton disabled={support === 'unsupported' || Boolean(watchId)} variant="secondary" onClick={startWatch}>
          추적 시작
        </PrimaryButton>
        <PrimaryButton disabled={!watchId} variant="danger" onClick={stopWatch}>
          추적 중지
        </PrimaryButton>
      </div>
      <ResultBox title="위치 결과">
        <pre>
          {JSON.stringify({ reading, watchActive: Boolean(watchId), error }, null, 2)}
        </pre>
      </ResultBox>
    </ApiCard>
  );
}
