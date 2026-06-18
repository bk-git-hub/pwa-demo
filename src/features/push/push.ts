import type { FeatureResult, FeatureSupport } from '../../shared/types/feature';

export type PushStatus = {
  supported: boolean;
  hasServiceWorker: boolean;
  hasSubscription: boolean;
  subscription?: PushSubscriptionJSON;
  note: string;
};

export function pushSupport(): FeatureSupport {
  return 'PushManager' in window && 'serviceWorker' in navigator ? 'supported' : 'unsupported';
}

export async function inspectPush(registration?: ServiceWorkerRegistration): Promise<FeatureResult<PushStatus>> {
  const supported = pushSupport() === 'supported';
  if (!supported) {
    return {
      ok: true,
      data: {
        supported: false,
        hasServiceWorker: Boolean(registration),
        hasSubscription: false,
        note: '이 브라우저는 Push API를 지원하지 않습니다.',
      },
    };
  }

  const subscription = registration ? await registration.pushManager.getSubscription() : null;
  return {
    ok: true,
    data: {
      supported: true,
      hasServiceWorker: Boolean(registration),
      hasSubscription: Boolean(subscription),
      subscription: subscription?.toJSON(),
      note: '실제 원격 push는 백엔드 엔드포인트와 VAPID 키가 필요합니다. 이 데모는 원격 push를 흉내 내지 않습니다.',
    },
  };
}
