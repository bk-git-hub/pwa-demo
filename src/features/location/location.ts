import type { FeatureResult, FeatureSupport } from '../../shared/types/feature';

export type LocationReading = {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
};

function toReading(position: GeolocationPosition): LocationReading {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    timestamp: new Date(position.timestamp).toISOString(),
  };
}

export function locationSupport(): FeatureSupport {
  return 'geolocation' in navigator ? 'supported' : 'unsupported';
}

export function getCurrentLocation(): Promise<FeatureResult<LocationReading>> {
  if (locationSupport() === 'unsupported') {
    return Promise.resolve({ ok: false, error: 'Geolocation API is not supported in this browser.' });
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ ok: true, data: toReading(position) }),
      (error) => resolve({ ok: false, error: error.message }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  });
}

export function watchLocation(
  onReading: (reading: LocationReading) => void,
  onError: (message: string) => void,
): FeatureResult<number> {
  if (locationSupport() === 'unsupported') {
    return { ok: false, error: 'Geolocation API is not supported in this browser.' };
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => onReading(toReading(position)),
    (error) => onError(error.message),
    { enableHighAccuracy: true, maximumAge: 5000 },
  );

  return { ok: true, data: watchId };
}

export function clearLocationWatch(watchId?: number | null) {
  if (typeof watchId === 'number') {
    navigator.geolocation.clearWatch(watchId);
  }
}
