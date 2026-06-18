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
      setState((current) => ({ ...current, error: '이 브라우저에서는 아직 설치 프롬프트를 사용할 수 없습니다.' }));
      return;
    }

    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    setPromptEvent(null);
    setState((current) => ({ ...current, canInstall: false, outcome: choice.outcome }));
  }, [promptEvent]);

  const note = useMemo(() => {
    if (state.isInstalled) {
      return '앱이 standalone 모드로 실행 중인 것으로 보입니다.';
    }
    return 'Chrome과 Edge는 beforeinstallprompt를 제공합니다. iOS Safari는 공유 > 홈 화면에 추가를 사용합니다.';
  }, [state.isInstalled]);

  return { ...state, promptInstall, note };
}
