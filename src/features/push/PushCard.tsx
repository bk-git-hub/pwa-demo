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
      title="Push 알림"
      description="Push API 지원 여부를 확인하고, 실제 구독 흐름에 필요한 백엔드 요소를 설명합니다."
      support={support}
      note="이 모듈은 고급 실습용입니다. 백엔드와 VAPID 키 없이 원격 push를 가짜로 만들지 않습니다."
      tone="gray"
    >
      <div className="actions">
        <PrimaryButton onClick={inspect}>Push 지원 확인</PrimaryButton>
      </div>
      <ResultBox result={result} title="Push 상태" />
    </ApiCard>
  );
}
