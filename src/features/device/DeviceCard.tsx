import { useEffect, useRef, useState } from 'react';
import { ApiCard } from '../../shared/components/ApiCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResultBox } from '../../shared/components/ResultBox';
import type { FeatureResult } from '../../shared/types/feature';
import {
  deviceSupport,
  requestOrientationPermission,
  requestWakeLock,
  setDemoBadge,
  subscribeOrientation,
  vibrateDemo,
  type OrientationReading,
} from './device';

type WakeLockLike = Awaited<ReturnType<typeof requestWakeLock>>['data'];

export function DeviceCard() {
  const wakeLockRef = useRef<WakeLockLike>(undefined);
  const orientationCleanup = useRef<(() => void) | null>(null);
  const [reading, setReading] = useState<OrientationReading | null>(null);
  const [result, setResult] = useState<FeatureResult<unknown>>();
  const [watching, setWatching] = useState(false);
  const support = deviceSupport();

  useEffect(
    () => () => {
      orientationCleanup.current?.();
      void wakeLockRef.current?.release();
    },
    [],
  );

  const toggleOrientation = async () => {
    if (watching) {
      orientationCleanup.current?.();
      orientationCleanup.current = null;
      setWatching(false);
      return;
    }
    const permission = await requestOrientationPermission();
    if (!permission.ok) {
      setResult(permission);
      return;
    }
    orientationCleanup.current = subscribeOrientation(setReading);
    setWatching(true);
    setResult(permission);
  };

  const wake = async () => {
    const next = await requestWakeLock();
    if (next.ok) {
      wakeLockRef.current = next.data;
    }
    setResult(next);
  };

  const badge = async () => {
    setResult(await setDemoBadge(3));
  };

  return (
    <ApiCard
      id="device"
      title="최신 디바이스 API"
      description="기기 방향, 진동, Wake Lock, 앱 배지처럼 선택적으로 쓸 수 있는 API를 실습합니다."
      support={support}
      note="이 API들은 점진적 향상 기능입니다. 브라우저, 플랫폼, 설치 앱 여부에 따라 지원 차이가 큽니다."
      tone="red"
    >
      <div className="actions">
        <PrimaryButton variant="secondary" onClick={toggleOrientation}>
          {watching ? '기울기 중지' : '기울기 보기'}
        </PrimaryButton>
        <PrimaryButton variant="secondary" onClick={() => setResult(vibrateDemo())}>
          진동
        </PrimaryButton>
        <PrimaryButton variant="secondary" onClick={wake}>
          화면 켜두기
        </PrimaryButton>
        <PrimaryButton variant="secondary" onClick={badge}>
          배지 설정
        </PrimaryButton>
      </div>
      <ResultBox title="디바이스 결과">
        <pre>{JSON.stringify({ orientation: reading, result }, null, 2)}</pre>
      </ResultBox>
    </ApiCard>
  );
}
