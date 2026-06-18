import type { FeatureResult, FeatureSupport } from '../../shared/types/feature';

export type PickedImage = {
  url: string;
  name: string;
  type: string;
  size: number;
  source: 'file-input' | 'file-system-access';
};

type FilePickerWindow = Window & {
  showOpenFilePicker?: (options?: unknown) => Promise<Array<{ getFile: () => Promise<File> }>>;
};

export function fileInputSupport(): FeatureSupport {
  return typeof File !== 'undefined' ? 'supported' : 'unsupported';
}

export function fileSystemPickerSupport(): FeatureSupport {
  return typeof window !== 'undefined' && 'showOpenFilePicker' in window ? 'supported' : 'unsupported';
}

export function createImagePreview(file: File, source: PickedImage['source']): FeatureResult<PickedImage> {
  if (!file.type.startsWith('image/')) {
    return { ok: false, error: '이미지 파일을 선택해 주세요.' };
  }

  return {
    ok: true,
    data: {
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
      source,
    },
  };
}

export function revokeImagePreview(image?: PickedImage | null) {
  if (image?.url) {
    URL.revokeObjectURL(image.url);
  }
}

export async function pickWithFileSystemAccess(): Promise<FeatureResult<PickedImage>> {
  if (fileSystemPickerSupport() === 'unsupported') {
    return { ok: false, error: '이 브라우저는 File System Access API를 지원하지 않습니다.' };
  }

  try {
    const [handle] = await (window as FilePickerWindow).showOpenFilePicker?.({
      types: [{ description: 'Images', accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] } }],
      multiple: false,
    })!;
    const file = await handle.getFile();
    return createImagePreview(file, 'file-system-access');
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : '파일 선택이 취소되었습니다.' };
  }
}
