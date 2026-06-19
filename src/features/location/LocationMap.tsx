import type { LocationReading } from './location';

const MAP_DELTA = 0.006;

function buildOpenStreetMapUrl(reading: LocationReading) {
  const west = reading.longitude - MAP_DELTA;
  const south = reading.latitude - MAP_DELTA;
  const east = reading.longitude + MAP_DELTA;
  const north = reading.latitude + MAP_DELTA;
  const bbox = [west, south, east, north].map((value) => value.toFixed(6)).join(',');
  const marker = `${reading.latitude.toFixed(6)},${reading.longitude.toFixed(6)}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&marker=${encodeURIComponent(marker)}`;
}

function buildOpenStreetMapLink(reading: LocationReading) {
  const latitude = reading.latitude.toFixed(6);
  const longitude = reading.longitude.toFixed(6);
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`;
}

type LocationMapProps = {
  reading: LocationReading | null;
};

export function LocationMap({ reading }: LocationMapProps) {
  if (!reading) {
    return (
      <div className="mapPlaceholder">
        <strong>지도 대기 중</strong>
        <span>현재 위치를 가져오면 OpenStreetMap 지도가 여기에 표시됩니다.</span>
      </div>
    );
  }

  return (
    <div className="mapPanel">
      <iframe
        className="mapFrame"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={buildOpenStreetMapUrl(reading)}
        title="현재 위치 지도"
      />
      <a className="mapLink" href={buildOpenStreetMapLink(reading)} rel="noreferrer" target="_blank">
        OpenStreetMap에서 크게 보기
      </a>
    </div>
  );
}
