import { useEffect, useRef, useState } from 'react';
import { ApiCard } from '../../shared/components/ApiCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResultBox } from '../../shared/components/ResultBox';
import type { PermissionStateLabel } from '../../shared/types/feature';
import { queryPermission } from '../permissions/permissions';
import { CameraFacingSelector } from './CameraFacingSelector';
import {
  CAMERA_FACING_LABELS,
  cameraSupport,
  captureStill,
  startCamera,
  stopCameraStream,
  type CameraFacingMode,
  type CapturedImage,
} from './camera';

export function CameraCard() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<CameraFacingMode>('environment');
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

  const openCamera = async (mode = facingMode) => {
    setLoading(true);
    setError(null);
    const result = await startCamera(mode);
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

  const changeFacingMode = async (nextMode: CameraFacingMode) => {
    setFacingMode(nextMode);
    setCapture(null);
    if (!stream) {
      return;
    }
    stopCameraStream(stream);
    setStream(null);
    await openCamera(nextMode);
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
      description="getUserMedia로 전면/후면 카메라를 요청하고, 실시간 미리보기와 정지 화면 캡처를 실습합니다."
      support={support}
      permission={permission}
      note="facingMode는 ideal 요청이라 기기와 브라우저에 따라 선택한 방향과 다르게 열릴 수 있습니다. 카메라를 끄거나 바꾸면 MediaStreamTrack을 정리합니다."
      tone="teal"
    >
      <video className="mediaPreview" ref={videoRef} autoPlay muted playsInline />
      <CameraFacingSelector
        disabled={support === 'unsupported' || loading}
        value={facingMode}
        onChange={(mode) => void changeFacingMode(mode)}
      />
      <div className="actions">
        <PrimaryButton
          disabled={support === 'unsupported' || loading || Boolean(stream)}
          onClick={() => void openCamera()}
        >
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
              facingMode,
              camera: CAMERA_FACING_LABELS[facingMode],
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
