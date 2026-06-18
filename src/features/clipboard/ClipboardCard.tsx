import { useState } from 'react';
import { ApiCard } from '../../shared/components/ApiCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResultBox } from '../../shared/components/ResultBox';
import type { FeatureResult, PermissionStateLabel } from '../../shared/types/feature';
import { queryPermission } from '../permissions/permissions';
import { clipboardSupport, copyText } from './clipboard';

const DEMO_TEXT = 'pwa-demo 클립보드 모듈에서 복사한 문장입니다.';

export function ClipboardCard() {
  const [permission, setPermission] = useState<PermissionStateLabel>('unknown');
  const [result, setResult] = useState<FeatureResult<unknown>>();
  const support = clipboardSupport();

  const copy = async () => {
    setPermission(await queryPermission('clipboard-write'));
    setResult(await copyText(DEMO_TEXT));
  };

  return (
    <ApiCard
      id="clipboard"
      title="클립보드"
      description="사용자 클릭 이후 navigator.clipboard.writeText로 데모 문장을 복사합니다."
      support={support}
      permission={permission}
      note="클립보드는 HTTPS와 사용자 제스처가 거의 항상 필요합니다. 읽기 권한은 쓰기보다 더 엄격합니다."
      tone="blue"
    >
      <div className="actions">
        <PrimaryButton disabled={support === 'unsupported'} onClick={copy}>
          데모 문장 복사
        </PrimaryButton>
      </div>
      <ResultBox result={result} title="클립보드 결과" />
    </ApiCard>
  );
}
