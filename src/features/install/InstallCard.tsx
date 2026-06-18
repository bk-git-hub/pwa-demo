import { ApiCard } from '../../shared/components/ApiCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResultBox } from '../../shared/components/ResultBox';
import { useInstallPrompt } from './useInstallPrompt';

export function InstallCard() {
  const install = useInstallPrompt();
  const support = install.isInstalled || install.canInstall ? 'supported' : 'unknown';

  return (
    <ApiCard
      id="install"
      title="Install Prompt"
      description="Detect installability and show a custom install action where the browser allows it."
      support={support}
      note="iOS Safari does not expose beforeinstallprompt; students should use Share > Add to Home Screen."
      tone="blue"
    >
      <div className="actions">
        <PrimaryButton disabled={!install.canInstall} onClick={install.promptInstall}>
          Install app
        </PrimaryButton>
      </div>
      <ResultBox title="Install state">
        <pre>
          {JSON.stringify(
            {
              canInstall: install.canInstall,
              isInstalled: install.isInstalled,
              outcome: install.outcome ?? 'none',
              note: install.note,
              error: install.error ?? null,
            },
            null,
            2,
          )}
        </pre>
      </ResultBox>
    </ApiCard>
  );
}
