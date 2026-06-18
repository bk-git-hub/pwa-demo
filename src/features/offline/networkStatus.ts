import { useEffect, useState } from 'react';

export type NetworkStatus = {
  online: boolean;
  changedAt: string;
};

export function getNetworkStatus(): NetworkStatus {
  return {
    online: navigator.onLine,
    changedAt: new Date().toISOString(),
  };
}

export function subscribeNetworkStatus(callback: (status: NetworkStatus) => void) {
  const update = () => callback(getNetworkStatus());
  window.addEventListener('online', update);
  window.addEventListener('offline', update);

  return () => {
    window.removeEventListener('online', update);
    window.removeEventListener('offline', update);
  };
}

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>(() => getNetworkStatus());

  useEffect(() => subscribeNetworkStatus(setStatus), []);

  return status;
}
