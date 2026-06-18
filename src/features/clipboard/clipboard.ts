import type { FeatureResult, FeatureSupport } from '../../shared/types/feature';

export function clipboardSupport(): FeatureSupport {
  return typeof navigator.clipboard?.writeText === 'function' ? 'supported' : 'unsupported';
}

export async function copyText(text: string): Promise<FeatureResult<{ copiedText: string; copiedAt: string }>> {
  if (clipboardSupport() === 'unsupported') {
    return { ok: false, error: 'Clipboard write is not supported in this browser.' };
  }

  try {
    await navigator.clipboard.writeText(text);
    return { ok: true, data: { copiedText: text, copiedAt: new Date().toISOString() } };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Clipboard write failed.' };
  }
}
