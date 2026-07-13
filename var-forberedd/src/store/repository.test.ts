import { beforeEach, describe, expect, it } from 'vitest';
import { seedAppState } from '../data/seed';
import { load, save } from './repository';

function skapaMinnesLagring(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key: string) => (data.has(key) ? data.get(key)! : null),
    key: (index: number) => Array.from(data.keys())[index] ?? null,
    removeItem: (key: string) => {
      data.delete(key);
    },
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

beforeEach(() => {
  globalThis.localStorage = skapaMinnesLagring();
});

describe('seed', () => {
  it('innehåller 5 identiteter, 7 lärsteg och 4 spelområden', () => {
    expect(seedAppState.identiteter).toHaveLength(5);
    expect(seedAppState.larsteg).toHaveLength(7);
    expect(seedAppState.spelomraden).toHaveLength(4);
  });
});

describe('repository', () => {
  it('load faller tillbaka på seed när localStorage är tom', () => {
    const state = load();
    expect(state.identiteter).toHaveLength(5);
    expect(state.larsteg).toHaveLength(7);
    expect(state.spelomraden).toHaveLength(4);
  });

  it('save→load rundtrippar via localStorage', () => {
    const andrad = { ...seedAppState, aktivtLarstegId: 'test-rundtripp' };
    save(andrad);
    const laddad = load();
    expect(laddad.aktivtLarstegId).toBe('test-rundtripp');
    expect(laddad.identiteter).toHaveLength(5);
  });
});
