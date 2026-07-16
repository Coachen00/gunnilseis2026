export const TACTICS_LIBRARY_CATEGORIES = {
  anfall: { label: "Anfallsspel", folders: ["Uppställningar", "Speluppbyggnad", "Sista tredjedelen"] },
  forsvar: { label: "Försvarsspel", folders: ["Högt försvar", "Mellanblock", "Lågt försvar"] },
  omstallning: { label: "Omställning", folders: ["Omställning anfall", "Omställning försvar"] },
  fasta: { label: "Fasta situationer", folders: ["Hörnor", "Frisparkar", "Inkast"] },
  ovrigt: { label: "Övrigt", folders: ["Egna mallar"] },
} as const;

export type TacticsLibraryCategory = keyof typeof TACTICS_LIBRARY_CATEGORIES;
export type TacticsLibraryItem = { id: string; title: string; category: TacticsLibraryCategory; folder: string; image: string; savedAt: string };

const DB_NAME = "gunnilse-taktikbibliotek";
const DB_VERSION = 1;
const STORE_NAME = "bilder";

function openLibrary(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") { reject(new Error("IndexedDB saknas i den här webbläsaren.")); return; }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Kunde inte öppna biblioteket."));
  });
}

export async function listTacticsLibraryItems(): Promise<TacticsLibraryItem[]> {
  const db = await openLibrary();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve((request.result as TacticsLibraryItem[]).sort((a, b) => b.savedAt.localeCompare(a.savedAt)));
    request.onerror = () => reject(request.error ?? new Error("Kunde inte läsa biblioteket."));
  });
}

export async function saveTacticsLibraryItem(item: TacticsLibraryItem): Promise<void> {
  const db = await openLibrary();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(item);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error("Kunde inte spara filen."));
  });
}

export async function removeTacticsLibraryItem(id: string): Promise<void> {
  const db = await openLibrary();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error("Kunde inte ta bort filen."));
  });
}
