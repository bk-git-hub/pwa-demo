import { CAMERA_FACING_LABELS, type CameraFacingMode } from './camera';

const cameraFacingOptions: CameraFacingMode[] = ['environment', 'user'];

type CameraFacingSelectorProps = {
  disabled: boolean;
  value: CameraFacingMode;
  onChange: (mode: CameraFacingMode) => void;
};

export function CameraFacingSelector({ disabled, value, onChange }: CameraFacingSelectorProps) {
  return (
    <div className="fieldGroup">
      <span className="fieldLabel">카메라 방향</span>
      <div className="segmentedControl" role="group" aria-label="카메라 방향 선택">
        {cameraFacingOptions.map((option) => (
          <button
            aria-pressed={value === option}
            className={`segmentButton ${value === option ? 'selected' : ''}`}
            disabled={disabled}
            key={option}
            onClick={() => onChange(option)}
            type="button"
          >
            {CAMERA_FACING_LABELS[option]}
          </button>
        ))}
      </div>
    </div>
  );
}
