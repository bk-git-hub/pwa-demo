import { useState } from 'react';
import { ApiCard } from '../../shared/components/ApiCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResultBox } from '../../shared/components/ResultBox';
import type { FeatureResult } from '../../shared/types/feature';
import { shareDemo, shareSupport, type ShareResult } from './share';

export function ShareCard() {
  const [result, setResult] = useState<FeatureResult<ShareResult>>();
  const support = shareSupport();

  const share = async () => {
    setResult(await shareDemo());
  };

  return (
    <ApiCard
      id="share"
      title="Web Share"
      description="지원되는 환경에서는 네이티브 공유 시트를 열고, 미지원 브라우저에서는 클립보드 fallback을 사용합니다."
      support={support}
      note="Web Share는 모바일 지원이 가장 좋고, 반드시 사용자 액션에서 실행해야 합니다."
      tone="teal"
    >
      <div className="actions">
        <PrimaryButton onClick={share}>이 앱 공유</PrimaryButton>
      </div>
      <ResultBox result={result} title="공유 결과" />
    </ApiCard>
  );
}
