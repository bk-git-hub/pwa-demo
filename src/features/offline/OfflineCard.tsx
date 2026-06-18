import { ApiCard } from '../../shared/components/ApiCard';
import { ResultBox } from '../../shared/components/ResultBox';
import { useNetworkStatus } from './networkStatus';

export function OfflineCard() {
  const status = useNetworkStatus();

  return (
    <ApiCard
      id="offline"
      title="Online / Offline"
      description="Read navigator.onLine and react to live online/offline events."
      support="supported"
      note="Use browser devtools network controls to test offline. The service worker caches the app after first load."
      tone={status.online ? 'green' : 'red'}
    >
      <ResultBox title="Network state">
        <pre>
          {JSON.stringify(
            {
              online: status.online,
              label: status.online ? 'online' : 'offline',
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
