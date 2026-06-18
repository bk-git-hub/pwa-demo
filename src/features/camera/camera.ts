import type { FeatureResult, FeatureSupport } from '../../shared/types/feature';

export type CapturedImage = {
  dataUrl: string;
  width: number;
  height: number;
  capturedAt: string;
};

export function cameraSupport(): FeatureSupport {
  return typeof navigator.mediaDevices?.getUserMedia === 'function' ? 'supported' : 'unsupported';
}

export async function startCamera(): Promise<FeatureResult<MediaStream>> {
  if (cameraSupport() === 'unsupported') {
    return { ok: false, error: 'Camera API is not supported in this browser.' };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    return { ok: true, data: stream };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Camera permission failed.' };
  }
}

export function stopCameraStream(stream?: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

export function captureStill(video: HTMLVideoElement | null): FeatureResult<CapturedImage> {
  if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
    return { ok: false, error: 'Camera preview is not ready yet.' };
  }

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  if (!context) {
    return { ok: false, error: 'Canvas is not available.' };
  }

  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return {
    ok: true,
    data: {
      dataUrl: canvas.toDataURL('image/png'),
      width: canvas.width,
      height: canvas.height,
      capturedAt: new Date().toISOString(),
    },
  };
}
