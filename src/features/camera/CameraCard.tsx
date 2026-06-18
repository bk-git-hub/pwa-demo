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
    setError(result.error ?? 'Camera could not start.');
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
    setError(result.error ?? 'Capture failed.');
  };

  return (
    <ApiCard
      id="camera"
      title="Camera"
      description="Request camera permission, show a live preview, and capture a still image."
      support={support}
      permission={permission}
      note="Requires HTTPS except on localhost. Streams are stopped when the camera closes or the card unmounts."
      tone="teal"
    >
      <video className="mediaPreview" ref={videoRef} autoPlay muted playsInline />
      <div className="actions">
        <PrimaryButton disabled={support === 'unsupported' || loading || Boolean(stream)} onClick={openCamera}>
          {loading ? 'Starting...' : 'Start camera'}
        </PrimaryButton>
        <PrimaryButton disabled={!stream} variant="secondary" onClick={takePhoto}>
          Capture still
        </PrimaryButton>
        <PrimaryButton disabled={!stream} variant="danger" onClick={closeCamera}>
          Stop
        </PrimaryButton>
      </div>
      {capture ? <img className="mediaPreview" src={capture.dataUrl} alt="Captured camera frame" /> : null}
      <ResultBox title="Camera result">
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
