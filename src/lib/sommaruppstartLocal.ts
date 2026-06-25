/**
 * Local storage för Sommaruppstart-arbetsytan (per webbläsare, personligt).
 *
 * Tre concerns, en nyckel var:
 *  - statuses : Record<spelarnamn, AvailabilityStatus>  spelartillgänglighet
 *  - confirms : Record<spelarnamn, ConfirmState>        tre bekräftelsefrågor
 *  - checks   : Record<stegId, boolean>                 kalender-/checklista
 *
 * Allt lagras tunt — bara avvikelser från fröet. Tål korrupt/saknad data.
 */

import type { AvailabilityStatus, ConfirmKey } from "@/data/sommaruppstart";

const PREFIX = "sommaruppstart:v1";
const K_STATUS = `${PREFIX}:statuses`;
const K_CONFIRM = `${PREFIX}:confirms`;
const K_CHECK = `${PREFIX}:checks`;

export type ConfirmState = Record<ConfirmKey, boolean | null>;

function read<T extends object>(key: string): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return {} as T;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`[sommaruppstartLocal] read ${key} failed:`, err);
    return {} as T;
  }
}

function write(key: string, value: object): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`[sommaruppstartLocal] write ${key} failed:`, err);
  }
}

/* ---- Spelarstatus ---- */
export const loadStatuses = () => read<Record<string, AvailabilityStatus>>(K_STATUS);
export const saveStatuses = (v: Record<string, AvailabilityStatus>) => write(K_STATUS, v);

/* ---- Bekräftelser ---- */
export const loadConfirms = () => read<Record<string, ConfirmState>>(K_CONFIRM);
export const saveConfirms = (v: Record<string, ConfirmState>) => write(K_CONFIRM, v);

/* ---- Checklista ---- */
export const loadChecks = () => read<Record<string, boolean>>(K_CHECK);
export const saveChecks = (v: Record<string, boolean>) => write(K_CHECK, v);

export function clearAllSommaruppstart(): void {
  [K_STATUS, K_CONFIRM, K_CHECK].forEach((k) => {
    try {
      window.localStorage.removeItem(k);
    } catch {
      /* noop */
    }
  });
}
