import { useEffect, useMemo, useState } from 'react';
import { CameraCard } from '../features/camera/CameraCard';
import { ClipboardCard } from '../features/clipboard/ClipboardCard';
import { DeviceCard } from '../features/device/DeviceCard';
import { GalleryCard } from '../features/gallery/GalleryCard';
import { InstallCard } from '../features/install/InstallCard';
import { LocationCard } from '../features/location/LocationCard';
import { NotificationsCard } from '../features/notifications/NotificationsCard';
import { OfflineCard } from '../features/offline/OfflineCard';
import { useNetworkStatus } from '../features/offline/networkStatus';
import { PushCard } from '../features/push/PushCard';
import { ShareCard } from '../features/share/ShareCard';
import { StorageCard } from '../features/storage/StorageCard';
import { applyServiceWorkerUpdate } from '../pwa/serviceWorkerMessages';
import { registerServiceWorker, type ServiceWorkerUiState } from '../pwa/registerServiceWorker';
import { PrimaryButton } from '../shared/components/PrimaryButton';
import { StatusPill } from '../shared/components/StatusPill';
import '../shared/components/components.css';
import './App.css';

const initialServiceWorker: ServiceWorkerUiState = {
  supported: 'serviceWorker' in navigator,
  enabled: false,
  registered: false,
  updateAvailable: false,
};

function standaloneStatus() {
  const standaloneNavigator = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || standaloneNavigator.standalone === true;
}

export function App() {
  const network = useNetworkStatus();
  const [serviceWorker, setServiceWorker] = useState<ServiceWorkerUiState>(initialServiceWorker);
  const [isStandalone, setIsStandalone] = useState(() => standaloneStatus());

  useEffect(() => registerServiceWorker(setServiceWorker), []);

  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)');
    const onChange = () => setIsStandalone(standaloneStatus());
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const feature = new URLSearchParams(window.location.search).get('feature');
    if (feature) {
      window.setTimeout(() => document.getElementById(feature)?.scrollIntoView({ block: 'start' }), 100);
    }
  }, []);

  const serviceWorkerValue = useMemo(() => {
    if (!serviceWorker.supported) {
      return 'unsupported';
    }
    if (serviceWorker.updateAvailable) {
      return 'waiting';
    }
    return serviceWorker.registered ? 'ready' : 'unknown';
  }, [serviceWorker]);

  return (
    <div className="appShell">
      <header className="appHeader">
        <div className="headerInner">
          <div className="brand">
            <img className="brandMark" src="/icons/logo.svg" alt="pwa-demo 로고" />
            <div>
              <h1>pwa-demo</h1>
              <p>교실에서 바로 쓰는 PWA 실습실</p>
            </div>
          </div>
          <div className="headerStatus">
            <StatusPill label="설치" value={isStandalone ? 'ready' : 'unknown'} />
            <StatusPill label="네트워크" value={network.online ? 'online' : 'offline'} />
            <StatusPill label="SW" value={serviceWorkerValue} />
            {serviceWorker.updateAvailable ? (
              <PrimaryButton variant="secondary" onClick={() => applyServiceWorkerUpdate(serviceWorker.registration)}>
                업데이트
              </PrimaryButton>
            ) : null}
          </div>
        </div>
      </header>

      <main className="content">
        <section className="intro">
          <div>
            <h2>PWA와 Web API 기능들</h2>
            <p>설치, 오프라인, 카메라, 위치, 알림, 공유, 클립보드, 저장소 기능을 한 화면에서 확인합니다.</p>
          </div>
        </section>

        <section className="cardGrid" aria-label="Web API 실습 카드">
          <InstallCard />
          <OfflineCard />
          <CameraCard />
          <GalleryCard />
          <LocationCard />
          <NotificationsCard serviceWorker={serviceWorker} />
          <PushCard serviceWorker={serviceWorker} />
          <ClipboardCard />
          <ShareCard />
          <StorageCard />
          <DeviceCard />
        </section>
      </main>
    </div>
  );
}
