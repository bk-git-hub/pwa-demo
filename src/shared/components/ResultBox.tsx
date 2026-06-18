import type { ReactNode } from 'react';
import type { FeatureResult } from '../types/feature';

type ResultBoxProps<T> = {
  title?: string;
  result?: FeatureResult<T>;
  children?: ReactNode;
};

export function ResultBox<T>({ title = 'Result', result, children }: ResultBoxProps<T>) {
  if (children) {
    return (
      <div className="resultBox">
        <strong>{title}</strong>
        <div>{children}</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="resultBox muted">
        <strong>{title}</strong>
        <span>No result yet.</span>
      </div>
    );
  }

  return (
    <div className={`resultBox ${result.ok ? 'successResult' : 'errorResult'}`}>
      <strong>{result.ok ? title : 'Error'}</strong>
      <pre>{result.ok ? JSON.stringify(result.data, null, 2) : result.error}</pre>
    </div>
  );
}
