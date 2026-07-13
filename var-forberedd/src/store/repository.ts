import type { AppState } from '../domain/types';
import { seedAppState } from '../data/seed';

const STORAGE_KEY = 'var-forberedd:v1';

function harLocalStorage(): boolean {
  return typeof localStorage !== 'undefined';
}

export function load(): AppState {
  if (!harLocalStorage()) return structuredClone(seedAppState);
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(seedAppState);
  try {
    return JSON.parse(raw) as AppState;
  } catch {
    return structuredClone(seedAppState);
  }
}

export function save(state: AppState): void {
  if (!harLocalStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetTillSeed(): AppState {
  const fresh = structuredClone(seedAppState);
  save(fresh);
  return fresh;
}
