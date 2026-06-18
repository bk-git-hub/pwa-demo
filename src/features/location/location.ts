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

function locationErrorMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return '위치 권한이 거부되었습니다.';
  }
  if (error.code === error.POSITION_UNAVAILABLE) {
    return '현재 위치 정보를 가져올 수 없습니다.';
  }
  if (error.code === error.TIMEOUT) {
    return '위치 요청 시간이 초과되었습니다.';
  }
  return error.message || '위치 요청에 실패했습니다.';
}

export function locationSupport(): FeatureSupport {
  return 'geolocation' in navigator ? 'supported' : 'unsupported';
}

export function getCurrentLocation(): Promise<FeatureResult<LocationReading>> {
  if (locationSupport() === 'unsupported') {
    return Promise.resolve({ ok: false, error: '이 브라우저는 Geolocation API를 지원하지 않습니다.' });
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ ok: true, data: toReading(position) }),
      (error) => resolve({ ok: false, error: locationErrorMessage(error) }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  });
}

export function watchLocation(
  onReading: (reading: LocationReading) => void,
  onError: (message: string) => void,
): FeatureResult<number> {
  if (locationSupport() === 'unsupported') {
    return { ok: false, error: '이 브라우저는 Geolocation API를 지원하지 않습니다.' };
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => onReading(toReading(position)),
    (error) => onError(locationErrorMessage(error)),
    { enableHighAccuracy: true, maximumAge: 5000 },
  );

  return { ok: true, data: watchId };
}

export function clearLocationWatch(watchId?: number | null) {
  if (typeof watchId === 'number') {
    navigator.geolocation.clearWatch(watchId);
  }
}
