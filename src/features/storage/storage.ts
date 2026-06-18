import type { FeatureResult, FeatureSupport } from '../../shared/types/feature';

const DB_NAME = 'pwa-demo-storage';
const STORE_NAME = 'history';
const DRAFT_KEY = 'pwa-demo-note-draft';

export type DemoRecord = {
  id: string;
  note: string;
  createdAt: string;
};

export function storageSupport(): FeatureSupport {
  return 'localStorage' in window && 'indexedDB' in window ? 'supported' : 'unsupported';
}

export function loadDraft() {
  return localStorage.getItem(DRAFT_KEY) ?? '';
}

export function saveDraft(value: string) {
  localStorage.setItem(DRAFT_KEY, value);
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>) {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const request = action(tx.objectStore(STORE_NAME));
    let result: T;
    request.onsuccess = () => {
      result = request.result;
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => {
      db.close();
      resolve(result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function saveRecord(note: string): Promise<FeatureResult<DemoRecord>> {
  if (storageSupport() === 'unsupported') {
    return { ok: false, error: 'localStorage or IndexedDB is not supported.' };
  }

  const record: DemoRecord = { id: crypto.randomUUID(), note, createdAt: new Date().toISOString() };
  try {
    await withStore('readwrite', (store) => store.put(record));
    return { ok: true, data: record };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Could not save record.' };
  }
}

export async function listRecords(): Promise<FeatureResult<DemoRecord[]>> {
  if (storageSupport() === 'unsupported') {
    return { ok: false, error: 'localStorage or IndexedDB is not supported.' };
  }

  try {
    const records = await withStore<DemoRecord[]>('readonly', (store) => store.getAll());
    return { ok: true, data: records.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Could not read records.' };
  }
}

export async function clearRecords(): Promise<FeatureResult<{ cleared: boolean }>> {
  try {
    localStorage.removeItem(DRAFT_KEY);
    await withStore('readwrite', (store) => store.clear());
    return { ok: true, data: { cleared: true } };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Could not clear records.' };
  }
}
