import type { ReactNode } from 'react';
import type { FeatureSupport, FeatureTone, PermissionStateLabel } from '../types/feature';
import { StatusPill } from './StatusPill';

type ApiCardProps = {
  id: string;
  title: string;
  description: string;
  support: FeatureSupport;
  permission?: PermissionStateLabel;
  note: string;
  tone?: FeatureTone;
  children: ReactNode;
};

export function ApiCard({
  id,
  title,
  description,
  support,
  permission,
  note,
  tone = 'blue',
  children,
}: ApiCardProps) {
  return (
    <section className={`apiCard ${tone}`} id={id}>
      <div className="apiCardHeader">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="pillStack">
          <StatusPill label="지원" value={support} />
          {permission ? <StatusPill label="권한" value={permission} /> : null}
        </div>
      </div>
      <div className="apiCardBody">{children}</div>
      <p className="limitation">{note}</p>
    </section>
  );
}
