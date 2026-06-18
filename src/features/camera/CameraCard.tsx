import { useEffect, useRef, useState } from 'react';
import { ApiCard } from '../../shared/components/ApiCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResultBox } from '../../shared/components/ResultBox';
import type { PermissionStateLabel } from '../../shared/types/feature';
import { queryPermission } from '../permissions/permissions';
import { cameraSupport, captureStill, startCamera, stopCameraStream, type CapturedImage } from './camera';

export function CameraCard() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permission, setPermission] = useState<PermissionStateLabel>('unknown');
  const [capture, setCapture] = useState<CapturedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const support = cameraSupport();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    void queryPermission('camera').then(setPermission);
    return () => stopCameraStream(stream);
  }, [stream]);

  const openCamera = async () => {
    setLoading(true);
    setError(null);
    const result = await startCamera();
    setLoading(false);
    if (result.ok && result.data) {
      setStream(result.data);
      setPermission('granted');
      return;
    }
    setError(result.error ?? '카메라를 시작할 수 없습니다.');
    setPermission('denied');
  };

  const closeCamera = () => {
    stopCameraStream(stream);
    setStream(null);
  };

  const takePhoto = () => {
    const result = captureStill(videoRef.current);
    if (result.ok && result.data) {
      setCapture(result.data);
      return;
    }
    setError(result.error ?? '사진 캡처에 실패했습니다.');
  };

  return (
    <ApiCard
      id="camera"
      title="카메라"
      description="getUserMedia로 카메라 권한을 요청하고, 실시간 미리보기와 정지 화면 캡처를 실습합니다."
      support={support}
      permission={permission}
      note="localhost를 제외하면 HTTPS가 필요합니다. 카메라를 끄거나 카드가 사라지면 MediaStreamTrack을 정리합니다."
      tone="teal"
    >
      <video className="mediaPreview" ref={videoRef} autoPlay muted playsInline />
      <div className="actions">
        <PrimaryButton disabled={support === 'unsupported' || loading || Boolean(stream)} onClick={openCamera}>
          {loading ? '시작 중...' : '카메라 시작'}
        </PrimaryButton>
        <PrimaryButton disabled={!stream} variant="secondary" onClick={takePhoto}>
          사진 캡처
        </PrimaryButton>
        <PrimaryButton disabled={!stream} variant="danger" onClick={closeCamera}>
          정지
        </PrimaryButton>
      </div>
      {capture ? <img className="mediaPreview" src={capture.dataUrl} alt="캡처한 카메라 화면" /> : null}
      <ResultBox title="카메라 결과">
        <pre>
          {JSON.stringify(
            {
              active: Boolean(stream),
              captured: capture ? { width: capture.width, height: capture.height, capturedAt: capture.capturedAt } : null,
              error,
            },
            null,
            2,
          )}
        </pre>
      </ResultBox>
    </ApiCard>
  );
}
