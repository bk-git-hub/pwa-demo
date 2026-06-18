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
  const [note, setNote] = useState(() => loadDraft());
  const [records, setRecords] = useState<DemoRecord[]>([]);
  const [result, setResult] = useState<FeatureResult<unknown>>();
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
    saveDraft(value);
  };

  const save = async () => {
    const trimmed = note.trim();
    const next = trimmed ? await saveRecord(trimmed) : { ok: false, error: 'Write a note first.' };
    setResult(next);
    if (next.ok) {
      setNote('');
      saveDraft('');
      await refresh();
    }
  };

  const clear = async () => {
    setResult(await clearRecords());
    setRecords([]);
    setNote('');
  };

  return (
    <ApiCard
      id="storage"
      title="Local Storage / IndexedDB"
      description="Save a draft in localStorage and structured history records in IndexedDB."
      support={support}
      note="Use localStorage for tiny simple values and IndexedDB for larger structured data or files."
      tone="green"
    >
      <textarea
        aria-label="Storage demo note"
        className="textInput"
        placeholder="Write a short note to store locally."
        value={note}
        onChange={(event) => updateNote(event.target.value)}
      />
      <div className="actions">
        <PrimaryButton disabled={support === 'unsupported'} onClick={save}>
          Save note
        </PrimaryButton>
        <PrimaryButton disabled={records.length === 0 && note.length === 0} variant="danger" onClick={clear}>
          Clear data
        </PrimaryButton>
      </div>
      <ResultBox title="Stored records">
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
