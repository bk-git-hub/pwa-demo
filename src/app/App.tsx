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
            <span className="brandMark">P</span>
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
            <h2>설치형 PWA와 브라우저 Web API를 한 화면에서 실습합니다.</h2>
            <p>
              저장소를 클론하고 HTTPS로 배포한 뒤 모바일에서 설치해 보세요. 성공, 오류, 권한, 지원 여부,
              정리(cleanup)까지 학생들이 눈으로 확인할 수 있게 구성했습니다.
            </p>
          </div>
          <aside className="noticePanel" aria-label="브라우저 보안 안내">
            <strong>수업 전 확인</strong>
            <ul>
              <li>대부분의 API는 HTTPS가 필요하고, localhost는 보통 안전한 환경으로 취급됩니다.</li>
              <li>Netlify와 Vercel은 배포 후 HTTPS를 기본으로 제공합니다.</li>
              <li>지원하지 않는 브라우저에서도 앱이 깨지지 않고 안내를 보여줍니다.</li>
            </ul>
          </aside>
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
