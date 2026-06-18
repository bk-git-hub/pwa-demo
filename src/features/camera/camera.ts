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
    return { ok: false, error: '이 브라우저는 Camera API를 지원하지 않습니다.' };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    return { ok: true, data: stream };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : '카메라 권한 요청에 실패했습니다.' };
  }
}

export function stopCameraStream(stream?: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

export function captureStill(video: HTMLVideoElement | null): FeatureResult<CapturedImage> {
  if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
    return { ok: false, error: '카메라 미리보기가 아직 준비되지 않았습니다.' };
  }

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  if (!context) {
    return { ok: false, error: 'Canvas를 사용할 수 없습니다.' };
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
