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
              <p>Progressive Web App classroom lab</p>
            </div>
          </div>
          <div className="headerStatus">
            <StatusPill label="Install" value={isStandalone ? 'ready' : 'unknown'} />
            <StatusPill label="Network" value={network.online ? 'online' : 'offline'} />
            <StatusPill label="SW" value={serviceWorkerValue} />
            {serviceWorker.updateAvailable ? (
              <PrimaryButton variant="secondary" onClick={() => applyServiceWorkerUpdate(serviceWorker.registration)}>
                Update
              </PrimaryButton>
            ) : null}
          </div>
        </div>
      </header>

      <main className="content">
        <section className="intro">
          <div>
            <h2>Installable PWA demos for native-like Web APIs.</h2>
            <p>
              Clone, deploy to HTTPS, open on mobile, install, and test browser APIs with clear success, error,
              permission, support, and cleanup behavior.
            </p>
          </div>
          <aside className="noticePanel" aria-label="Browser security notes">
            <strong>Classroom checks</strong>
            <ul>
              <li>Most APIs require HTTPS; localhost is treated as secure.</li>
              <li>Netlify and Vercel provide HTTPS after deployment.</li>
              <li>Unsupported browsers show friendly fallback states.</li>
            </ul>
          </aside>
        </section>

        <section className="cardGrid" aria-label="Web API demo cards">
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
