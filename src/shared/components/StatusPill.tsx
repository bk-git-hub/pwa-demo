import type { FeatureSupport, PermissionStateLabel } from '../types/feature';

type StatusPillProps = {
  label: string;
  value: FeatureSupport | PermissionStateLabel | 'online' | 'offline' | 'ready' | 'waiting';
};

const toneByValue: Record<StatusPillProps['value'], string> = {
  supported: 'pillGood',
  granted: 'pillGood',
  online: 'pillGood',
  ready: 'pillGood',
  prompt: 'pillWarn',
  waiting: 'pillWarn',
  unknown: 'pillNeutral',
  unsupported: 'pillBad',
  denied: 'pillBad',
  offline: 'pillBad',
};

const valueLabels: Record<StatusPillProps['value'], string> = {
  supported: '지원됨',
  granted: '허용됨',
  online: '온라인',
  ready: '준비됨',
  prompt: '요청 전',
  waiting: '대기 중',
  unknown: '확인 중',
  unsupported: '미지원',
  denied: '거부됨',
  offline: '오프라인',
};

export function StatusPill({ label, value }: StatusPillProps) {
  return (
    <span className={`statusPill ${toneByValue[value]}`}>
      <span>{label}</span>
      <strong>{valueLabels[value]}</strong>
    </span>
  );
}
