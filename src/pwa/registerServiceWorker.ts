export type ServiceWorkerUiState = {
  supported: boolean;
  enabled: boolean;
  registered: boolean;
  updateAvailable: boolean;
  registration?: ServiceWorkerRegistration;
  error?: string;
};

const initialState: ServiceWorkerUiState = {
  supported: 'serviceWorker' in navigator,
  enabled: false,
  registered: false,
  updateAvailable: false,
};

function shouldRegister() {
  const localOverride = new URLSearchParams(window.location.search).get('sw') === '1';
  return import.meta.env.PROD || import.meta.env.VITE_ENABLE_SW === 'true' || localOverride;
}

export function registerServiceWorker(onChange: (state: ServiceWorkerUiState) => void) {
  if (!initialState.supported) {
    onChange(initialState);
    return () => undefined;
  }

  const enabled = shouldRegister();
  if (!enabled) {
    onChange({ ...initialState, supported: true, enabled: false });
    return () => undefined;
  }

  let reloadedForUpdate = false;
  const onControllerChange = () => {
    if (reloadedForUpdate) {
      return;
    }
    reloadedForUpdate = true;
    window.location.reload();
  };

  const runRegistration = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      onChange({ supported: true, enabled: true, registered: true, updateAvailable: false, registration });

      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        if (!installing) {
          return;
        }

        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            onChange({ supported: true, enabled: true, registered: true, updateAvailable: true, registration });
          }
        });
      });
    } catch (error) {
      onChange({
        supported: true,
        enabled: true,
        registered: false,
        updateAvailable: false,
        error: error instanceof Error ? error.message : 'Service worker registration failed.',
      });
    }
  };

  navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
  if (document.readyState === 'complete') {
    void runRegistration();
  } else {
    window.addEventListener('load', runRegistration, { once: true });
  }

  return () => {
    window.removeEventListener('load', runRegistration);
    navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  };
}
