import { ApiCard } from '../../shared/components/ApiCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResultBox } from '../../shared/components/ResultBox';
import { useInstallPrompt } from './useInstallPrompt';

function formatOutcome(outcome?: 'accepted' | 'dismissed') {
  if (outcome === 'accepted') {
    return '설치 수락';
  }
  if (outcome === 'dismissed') {
    return '설치 취소';
  }
  return '없음';
}

export function InstallCard() {
  const install = useInstallPrompt();
  const support = install.isInstalled || install.canInstall ? 'supported' : 'unknown';

  return (
    <ApiCard
      id="install"
      title="앱 설치"
      description="브라우저가 허용하는 경우 설치 가능 상태를 감지하고 직접 만든 설치 버튼을 보여줍니다."
      support={support}
      note="iOS Safari는 beforeinstallprompt 이벤트를 노출하지 않습니다. 공유 > 홈 화면에 추가 흐름으로 설치합니다."
      tone="blue"
    >
      <div className="actions">
        <PrimaryButton disabled={!install.canInstall} onClick={install.promptInstall}>
          앱 설치하기
        </PrimaryButton>
      </div>
      <ResultBox title="설치 상태">
        <pre>
          {JSON.stringify(
            {
              canInstall: install.canInstall,
              isInstalled: install.isInstalled,
              outcome: formatOutcome(install.outcome),
              note: install.note,
              error: install.error ?? null,
            },
            null,
            2,
          )}
        </pre>
      </ResultBox>
    </ApiCard>
  );
}
