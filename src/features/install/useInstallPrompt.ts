import { useCallback, useEffect, useMemo, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

type InstallPromptState = {
  canInstall: boolean;
  isInstalled: boolean;
  outcome?: 'accepted' | 'dismissed';
  error?: string;
};

function isStandaloneDisplay() {
  const standaloneNavigator = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || standaloneNavigator.standalone === true;
}

export function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [state, setState] = useState<InstallPromptState>({
    canInstall: false,
    isInstalled: typeof window !== 'undefined' ? isStandaloneDisplay() : false,
  });

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
      setState((current) => ({ ...current, canInstall: true, error: undefined }));
    };

    const onAppInstalled = () => {
      setPromptEvent(null);
      setState({ canInstall: false, isInstalled: true, outcome: 'accepted' });
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!promptEvent) {
      setState((current) => ({ ...current, error: 'Install prompt is not available in this browser yet.' }));
      return;
    }

    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    setPromptEvent(null);
    setState((current) => ({ ...current, canInstall: false, outcome: choice.outcome }));
  }, [promptEvent]);

  const note = useMemo(() => {
    if (state.isInstalled) {
      return 'The app appears to be running in standalone mode.';
    }
    return 'Chrome and Edge expose beforeinstallprompt. iOS Safari uses Share > Add to Home Screen.';
  }, [state.isInstalled]);

  return { ...state, promptInstall, note };
}
