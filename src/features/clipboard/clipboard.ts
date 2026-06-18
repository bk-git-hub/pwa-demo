import type { FeatureResult, FeatureSupport } from '../../shared/types/feature';

export function clipboardSupport(): FeatureSupport {
  return typeof navigator.clipboard?.writeText === 'function' ? 'supported' : 'unsupported';
}

export async function copyText(text: string): Promise<FeatureResult<{ copiedText: string; copiedAt: string }>> {
  if (clipboardSupport() === 'unsupported') {
    return { ok: false, error: '이 브라우저는 클립보드 쓰기를 지원하지 않습니다.' };
  }

  try {
    await navigator.clipboard.writeText(text);
    return { ok: true, data: { copiedText: text, copiedAt: new Date().toISOString() } };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : '클립보드 쓰기에 실패했습니다.' };
  }
}
