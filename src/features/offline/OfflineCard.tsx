import { ApiCard } from '../../shared/components/ApiCard';
import { ResultBox } from '../../shared/components/ResultBox';
import { useNetworkStatus } from './networkStatus';

export function OfflineCard() {
  const status = useNetworkStatus();

  return (
    <ApiCard
      id="offline"
      title="온라인 / 오프라인"
      description="navigator.onLine과 online/offline 이벤트로 네트워크 상태 변화를 확인합니다."
      support="supported"
      note="브라우저 개발자 도구의 Network 패널에서 오프라인을 테스트해 보세요. 서비스 워커가 앱 셸을 캐시합니다."
      tone={status.online ? 'green' : 'red'}
    >
      <ResultBox title="네트워크 상태">
        <pre>
          {JSON.stringify(
            {
              online: status.online,
              label: status.online ? '온라인' : '오프라인',
              changedAt: status.changedAt,
            },
            null,
            2,
          )}
        </pre>
      </ResultBox>
    </ApiCard>
  );
}
