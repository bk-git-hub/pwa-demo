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
    text: '교실용 Progressive Web App 데모를 열어 보세요.',
    url: window.location.href,
  };

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share(shareData);
      return { ok: true, data: { mode: 'native-share', sharedAt: new Date().toISOString() } };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : '공유가 취소되었거나 실패했습니다.' };
    }
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(shareData.url);
      return { ok: true, data: { mode: 'clipboard-fallback', sharedAt: new Date().toISOString() } };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : '클립보드 fallback에 실패했습니다.' };
    }
  }

  return { ok: false, error: 'Web Share와 클립보드 fallback을 모두 사용할 수 없습니다.' };
}
