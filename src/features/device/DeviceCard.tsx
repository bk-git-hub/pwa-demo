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
      title="Modern Device APIs"
      description="Try optional APIs such as orientation, vibration, wake lock, and app badging."
      support={support}
      note="These APIs are progressive enhancements. Support varies heavily by browser, platform, and installed-app context."
      tone="red"
    >
      <div className="actions">
        <PrimaryButton variant="secondary" onClick={toggleOrientation}>
          {watching ? 'Stop tilt' : 'Watch tilt'}
        </PrimaryButton>
        <PrimaryButton variant="secondary" onClick={() => setResult(vibrateDemo())}>
          Vibrate
        </PrimaryButton>
        <PrimaryButton variant="secondary" onClick={wake}>
          Wake lock
        </PrimaryButton>
        <PrimaryButton variant="secondary" onClick={badge}>
          Set badge
        </PrimaryButton>
      </div>
      <ResultBox title="Device result">
        <pre>{JSON.stringify({ orientation: reading, result }, null, 2)}</pre>
      </ResultBox>
    </ApiCard>
  );
}
