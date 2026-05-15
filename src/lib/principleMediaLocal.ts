/**
 * Lokal persistens för PrincipleMediaSlot — used as fallback eftersom
 * Supabase-tabellen `principle_media` ännu inte är skapad i live-DB:n.
 *
 * Metadata (typ, url, text, caption) → localStorage (per nyckel).
 * Fil-blobbar (uppladdade video/bild) → IndexedDB (klarar GB-stora filer).
 *
 * Per device. Synkas inte mellan webbläsare/datorer. När migrationen körs
 * kan data flyttas över till Supabase via en separat sync-routine.
 */

export type LocalMediaType = "video" | "image" | "text";
export type LocalSourceKind = "url" | "upload" | "text";

export interface LocalSlotData {
  media_type: LocalMediaType;
  source_kind: LocalSourceKind;
  url: string | null;
  storage_path: string | null;
  text_title: string | null;
  text_body: string | null;
  caption: string | null;
  /** Senast skrivet — för debug/sync senare. */
  updated_at: string;
}

const LS_PREFIX = "principle-media:v1:";
const DB_NAME = "principle-media-local";
const DB_VERSION = 1;
const BLOB_STORE = "blobs";

/** Stabil nyckel som matchar Supabase-radens unique-index (block_id, principle_id). */
const slotKey = (blockId: string, principleId: string) => `${blockId}:${principleId}`;

/* =========================================================================
   LOCAL STORAGE — metadata
   ========================================================================= */

export function loadLocalSlot(blockId: string, principleId: string): LocalSlotData | null {
  try {
    const raw = window.localStorage.getItem(LS_PREFIX + slotKey(blockId, principleId));
    if (!raw) return null;
    return JSON.parse(raw) as LocalSlotData;
  } catch (err) {
    console.error("[principleMediaLocal] loadLocalSlot failed:", err);
    return null;
  }
}

export function saveLocalSlot(
  blockId: string,
  principleId: string,
  patch: Partial<Omit<LocalSlotData, "updated_at">>
): LocalSlotData {
  const existing = loadLocalSlot(blockId, principleId);
  const merged: LocalSlotData = {
    media_type: patch.media_type ?? existing?.media_type ?? "video",
    source_kind: patch.source_kind ?? existing?.source_kind ?? "url",
    url: patch.url !== undefined ? patch.url : existing?.url ?? null,
    storage_path:
      patch.storage_path !== undefined ? patch.storage_path : existing?.storage_path ?? null,
    text_title: patch.text_title !== undefined ? patch.text_title : existing?.text_title ?? null,
    text_body: patch.text_body !== undefined ? patch.text_body : existing?.text_body ?? null,
    caption: patch.caption !== undefined ? patch.caption : existing?.caption ?? null,
    updated_at: new Date().toISOString(),
  };
  window.localStorage.setItem(LS_PREFIX + slotKey(blockId, principleId), JSON.stringify(merged));
  return merged;
}

export function clearLocalSlot(blockId: string, principleId: string): void {
  window.localStorage.removeItem(LS_PREFIX + slotKey(blockId, principleId));
}

/* =========================================================================
   INDEXED DB — blob storage
   ========================================================================= */

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(BLOB_STORE)) {
        db.createObjectStore(BLOB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("Failed to open IndexedDB"));
  });
}

export async function saveLocalBlob(blockId: string, principleId: string, file: File): Promise<string> {
  const db = await openDb();
  const key = slotKey(blockId, principleId);
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(BLOB_STORE, "readwrite");
    tx.objectStore(BLOB_STORE).put(file, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Failed to write blob"));
  });
  db.close();
  return key;
}

export async function loadLocalBlobUrl(blockId: string, principleId: string): Promise<string | null> {
  const db = await openDb();
  const key = slotKey(blockId, principleId);
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(BLOB_STORE, "readonly");
    const req = tx.objectStore(BLOB_STORE).get(key);
    req.onsuccess = () => resolve((req.result as Blob | undefined) ?? null);
    req.onerror = () => reject(req.error ?? new Error("Failed to read blob"));
  });
  db.close();
  return blob ? URL.createObjectURL(blob) : null;
}

export async function removeLocalBlob(blockId: string, principleId: string): Promise<void> {
  const db = await openDb();
  const key = slotKey(blockId, principleId);
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(BLOB_STORE, "readwrite");
    tx.objectStore(BLOB_STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Failed to delete blob"));
  });
  db.close();
}

/** Försök estimera tillgängligt utrymme — användbart för informativ varning. */
export async function estimateStorage(): Promise<{ usageMb: number; quotaMb: number } | null> {
  if (typeof navigator === "undefined" || !navigator.storage?.estimate) return null;
  try {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    return { usageMb: Math.round(usage / 1024 / 1024), quotaMb: Math.round(quota / 1024 / 1024) };
  } catch {
    return null;
  }
}
