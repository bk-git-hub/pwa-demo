import { useState } from 'react';
import { ApiCard } from '../../shared/components/ApiCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResultBox } from '../../shared/components/ResultBox';
import type { FeatureResult, PermissionStateLabel } from '../../shared/types/feature';
import { queryPermission } from '../permissions/permissions';
import { clipboardSupport, copyText } from './clipboard';

const DEMO_TEXT = 'Copied from the pwa-demo clipboard module.';

export function ClipboardCard() {
  const [permission, setPermission] = useState<PermissionStateLabel>('unknown');
  const [result, setResult] = useState<FeatureResult<unknown>>();
  const support = clipboardSupport();

  const copy = async () => {
    setPermission(await queryPermission('clipboard-write'));
    setResult(await copyText(DEMO_TEXT));
  };

  return (
    <ApiCard
      id="clipboard"
      title="Clipboard"
      description="Copy demo text with navigator.clipboard.writeText after a user action."
      support={support}
      permission={permission}
      note="Clipboard access requires HTTPS and usually a user gesture. Read access is more restricted than write."
      tone="blue"
    >
      <div className="actions">
        <PrimaryButton disabled={support === 'unsupported'} onClick={copy}>
          Copy demo text
        </PrimaryButton>
      </div>
      <ResultBox result={result} title="Clipboard result" />
    </ApiCard>
  );
}
