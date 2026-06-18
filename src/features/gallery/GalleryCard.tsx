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
      setError(result.error ?? 'Could not load file.');
    }
  };

  const useAdvancedPicker = async () => {
    const result = await pickWithFileSystemAccess();
    if (result.ok && result.data) {
      replaceImage(result.data);
    } else {
      setError(result.error ?? 'Advanced picker failed.');
    }
  };

  return (
    <ApiCard
      id="gallery"
      title="Gallery / File Picker"
      description="Pick an image, preview it, and inspect file metadata."
      support={support}
      note="A regular file input is most compatible. File System Access is useful but not universal."
      tone="orange"
    >
      <input ref={inputRef} hidden type="file" accept="image/*" onChange={onInputChange} />
      {image ? <img className="mediaPreview" src={image.url} alt={image.name} /> : <div className="mediaPreview" />}
      <div className="actions">
        <PrimaryButton disabled={support === 'unsupported'} onClick={() => inputRef.current?.click()}>
          Choose image
        </PrimaryButton>
        <PrimaryButton disabled={advancedSupport === 'unsupported'} variant="secondary" onClick={useAdvancedPicker}>
          Advanced picker
        </PrimaryButton>
      </div>
      <ResultBox title="Selected file">
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
