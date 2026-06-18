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
        note: 'Push API is not supported in this browser.',
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
      note: 'Real remote push needs a backend endpoint and VAPID keys. This demo does not fake remote push.',
    },
  };
}
