import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ApiCard } from '../../shared/components/ApiCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResultBox } from '../../shared/components/ResultBox';
import {
  createImagePreview,
  fileInputSupport,
  fileSystemPickerSupport,
  pickWithFileSystemAccess,
  revokeImagePreview,
  type PickedImage,
} from './filePicker';

export function GalleryCard() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<PickedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const support = fileInputSupport();
  const advancedSupport = fileSystemPickerSupport();

  useEffect(() => () => revokeImagePreview(image), [image]);

  const replaceImage = (next: PickedImage) => {
    revokeImagePreview(image);
    setImage(next);
    setError(null);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const result = createImagePreview(file, 'file-input');
    if (result.ok && result.data) {
      replaceImage(result.data);
    } else {
      setError(result.error ?? '파일을 불러올 수 없습니다.');
    }
  };

  const useAdvancedPicker = async () => {
    const result = await pickWithFileSystemAccess();
    if (result.ok && result.data) {
      replaceImage(result.data);
    } else {
      setError(result.error ?? '고급 파일 선택에 실패했습니다.');
    }
  };

  return (
    <ApiCard
      id="gallery"
      title="갤러리 / 파일 선택"
      description="이미지를 선택하고 미리보기와 파일 이름, 타입, 크기를 확인합니다."
      support={support}
      note="일반 file input이 가장 호환성이 좋습니다. File System Access API는 유용하지만 모든 브라우저에서 지원되지는 않습니다."
      tone="orange"
    >
      <input ref={inputRef} hidden type="file" accept="image/*" onChange={onInputChange} />
      {image ? <img className="mediaPreview" src={image.url} alt={image.name} /> : <div className="mediaPreview" />}
      <div className="actions">
        <PrimaryButton disabled={support === 'unsupported'} onClick={() => inputRef.current?.click()}>
          이미지 선택
        </PrimaryButton>
        <PrimaryButton disabled={advancedSupport === 'unsupported'} variant="secondary" onClick={useAdvancedPicker}>
          고급 선택
        </PrimaryButton>
      </div>
      <ResultBox title="선택한 파일">
        <pre>
          {JSON.stringify(
            image
              ? { name: image.name, type: image.type, size: image.size, source: image.source }
              : { advancedSupport, error },
            null,
            2,
          )}
        </pre>
      </ResultBox>
    </ApiCard>
  );
}
