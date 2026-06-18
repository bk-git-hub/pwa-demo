import { useState } from 'react';
import { ApiCard } from '../../shared/components/ApiCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResultBox } from '../../shared/components/ResultBox';
import type { FeatureResult } from '../../shared/types/feature';
import type { ServiceWorkerUiState } from '../../pwa/registerServiceWorker';
import { inspectPush, pushSupport, type PushStatus } from './push';

type PushCardProps = {
  serviceWorker: ServiceWorkerUiState;
};

export function PushCard({ serviceWorker }: PushCardProps) {
  const [result, setResult] = useState<FeatureResult<PushStatus>>();
  const support = pushSupport();

  const inspect = async () => {
    setResult(await inspectPush(serviceWorker.registration));
  };

  return (
    <ApiCard
      id="push"
      title="Push Notifications"
      description="Check Push API support and explain what a real backend subscription flow needs."
      support={support}
      note="This module is intentionally advanced. It does not fake remote push without a backend and VAPID keys."
      tone="gray"
    >
      <div className="actions">
        <PrimaryButton onClick={inspect}>Check push support</PrimaryButton>
      </div>
      <ResultBox result={result} title="Push status" />
    </ApiCard>
  );
}
