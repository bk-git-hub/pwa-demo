import { useEffect, useState } from 'react';
import { ApiCard } from '../../shared/components/ApiCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResultBox } from '../../shared/components/ResultBox';
import type { FeatureResult } from '../../shared/types/feature';
import {
  clearRecords,
  listRecords,
  loadDraft,
  saveDraft,
  saveRecord,
  storageSupport,
  type DemoRecord,
} from './storage';

export function StorageCard() {
  const [note, setNote] = useState(() => loadDraft().data ?? '');
  const [records, setRecords] = useState<DemoRecord[]>([]);
  const [result, setResult] = useState<FeatureResult<unknown> | undefined>(() => {
    const draft = loadDraft();
    return draft.ok ? undefined : draft;
  });
  const support = storageSupport();

  const refresh = async () => {
    const next = await listRecords();
    if (next.ok && next.data) {
      setRecords(next.data);
    }
    setResult(next);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const updateNote = (value: string) => {
    setNote(value);
    const next = saveDraft(value);
    if (!next.ok) {
      setResult(next);
    }
  };

  const save = async () => {
    const trimmed = note.trim();
    const next = trimmed ? await saveRecord(trimmed) : { ok: false, error: '먼저 메모를 입력해 주세요.' };
    setResult(next);
    if (next.ok) {
      setNote('');
      const draft = saveDraft('');
      if (!draft.ok) {
        setResult(draft);
        return;
      }
      await refresh();
    }
  };

  const clear = async () => {
    const next = await clearRecords();
    setResult(next);
    if (next.ok) {
      setRecords([]);
      setNote('');
    }
  };

  return (
    <ApiCard
      id="storage"
      title="로컬 저장소 / IndexedDB"
      description="간단한 임시 메모는 localStorage에, 구조화된 기록은 IndexedDB에 저장합니다."
      support={support}
      note="작고 단순한 값은 localStorage, 더 큰 구조화 데이터나 파일은 IndexedDB가 어울립니다."
      tone="green"
    >
      <textarea
        aria-label="저장소 데모 메모"
        className="textInput"
        placeholder="로컬에 저장할 짧은 메모를 입력하세요."
        value={note}
        onChange={(event) => updateNote(event.target.value)}
      />
      <div className="actions">
        <PrimaryButton disabled={support === 'unsupported'} onClick={save}>
          메모 저장
        </PrimaryButton>
        <PrimaryButton disabled={records.length === 0 && note.length === 0} variant="danger" onClick={clear}>
          데이터 지우기
        </PrimaryButton>
      </div>
      <ResultBox title="저장된 기록">
        {records.length > 0 ? (
          <ul className="historyList">
            {records.slice(0, 3).map((record) => (
              <li key={record.id}>
                <strong>{new Date(record.createdAt).toLocaleString()}</strong> {record.note}
              </li>
            ))}
          </ul>
        ) : (
          <pre>{JSON.stringify(result ?? { noteDrafted: Boolean(note) }, null, 2)}</pre>
        )}
      </ResultBox>
    </ApiCard>
  );
}
