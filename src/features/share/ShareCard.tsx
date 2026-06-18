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
      description="Open the native share sheet where available, with clipboard fallback on unsupported browsers."
      support={support}
      note="Web Share has strongest support on mobile and must be triggered by a user action."
      tone="teal"
    >
      <div className="actions">
        <PrimaryButton onClick={share}>Share this app</PrimaryButton>
      </div>
      <ResultBox result={result} title="Share result" />
    </ApiCard>
  );
}
