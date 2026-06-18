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

export function StatusPill({ label, value }: StatusPillProps) {
  return (
    <span className={`statusPill ${toneByValue[value]}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </span>
  );
}
