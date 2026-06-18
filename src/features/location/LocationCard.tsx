import { useEffect, useState } from 'react';
import { ApiCard } from '../../shared/components/ApiCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResultBox } from '../../shared/components/ResultBox';
import type { PermissionStateLabel } from '../../shared/types/feature';
import { queryPermission } from '../permissions/permissions';
import {
  clearLocationWatch,
  getCurrentLocation,
  locationSupport,
  watchLocation,
  type LocationReading,
} from './location';

export function LocationCard() {
  const [permission, setPermission] = useState<PermissionStateLabel>('unknown');
  const [reading, setReading] = useState<LocationReading | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const support = locationSupport();

  useEffect(() => {
    void queryPermission('geolocation').then(setPermission);
    return () => clearLocationWatch(watchId);
  }, [watchId]);

  const getLocation = async () => {
    setLoading(true);
    setError(null);
    const result = await getCurrentLocation();
    setLoading(false);
    if (result.ok && result.data) {
      setReading(result.data);
      setPermission('granted');
      return;
    }
    setError(result.error ?? 'Location request failed.');
    setPermission('denied');
  };

  const startWatch = () => {
    setError(null);
    const result = watchLocation(setReading, setError);
    if (result.ok && typeof result.data === 'number') {
      setWatchId(result.data);
      setPermission('granted');
    } else {
      setError(result.error ?? 'Could not start location watch.');
    }
  };

  const stopWatch = () => {
    clearLocationWatch(watchId);
    setWatchId(null);
  };

  return (
    <ApiCard
      id="location"
      title="Location / GPS"
      description="Request current coordinates and optionally watch live location updates."
      support={support}
      permission={permission}
      note="Requires HTTPS except on localhost. Browser settings or permissions policy can block access."
      tone="green"
    >
      <div className="actions">
        <PrimaryButton disabled={support === 'unsupported' || loading} onClick={getLocation}>
          {loading ? 'Locating...' : 'Get current location'}
        </PrimaryButton>
        <PrimaryButton disabled={support === 'unsupported' || Boolean(watchId)} variant="secondary" onClick={startWatch}>
          Watch
        </PrimaryButton>
        <PrimaryButton disabled={!watchId} variant="danger" onClick={stopWatch}>
          Stop watch
        </PrimaryButton>
      </div>
      <ResultBox title="Location result">
        <pre>
          {JSON.stringify({ reading, watchActive: Boolean(watchId), error }, null, 2)}
        </pre>
      </ResultBox>
    </ApiCard>
  );
}
