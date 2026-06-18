import type { FeatureResult, FeatureSupport } from '../../shared/types/feature';

export type ShareResult = {
  mode: 'native-share' | 'clipboard-fallback';
  sharedAt: string;
};

export function shareSupport(): FeatureSupport {
  return typeof navigator.share === 'function' ? 'supported' : 'unsupported';
}

export async function shareDemo(): Promise<FeatureResult<ShareResult>> {
  const shareData = {
    title: 'pwa-demo',
    text: 'Try this classroom Progressive Web App demo.',
    url: window.location.href,
  };

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share(shareData);
      return { ok: true, data: { mode: 'native-share', sharedAt: new Date().toISOString() } };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Share was cancelled or failed.' };
    }
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(shareData.url);
    return { ok: true, data: { mode: 'clipboard-fallback', sharedAt: new Date().toISOString() } };
  }

  return { ok: false, error: 'Web Share and clipboard fallback are both unavailable.' };
}
