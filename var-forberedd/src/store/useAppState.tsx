import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  AppState,
  Identitet,
  Larsteg,
  Matchbevis,
  Observation,
  Princip,
  Roll,
  SpelomradeId,
  Traneruppdrag,
} from '../domain/types';
import { load, resetTillSeed as resetRepository, save } from './repository';

function nyId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

interface AppStateContextValue {
  state: AppState;
  roll: Roll;
  setRoll: (roll: Roll) => void;
  setAktivtLarstegId: (id: string) => void;
  aktivtUppdragId: string | null;
  setAktivtUppdragId: (id: string | null) => void;
  aktivtMatchbevisId: string | null;
  setAktivtMatchbevisId: (id: string | null) => void;
  uppdateraLarsteg: (id: string, patch: Partial<Larsteg>) => void;
  uppdateraIdentitet: (id: string, patch: Partial<Identitet>) => void;
  skapaUppdrag: (uppdrag: Omit<Traneruppdrag, 'id'>) => Traneruppdrag;
  uppdateraUppdrag: (id: string, patch: Partial<Traneruppdrag>) => void;
  skapaMatchbevis: (bevis: Omit<Matchbevis, 'id'>) => Matchbevis;
  uppdateraMatchbevis: (id: string, patch: Partial<Matchbevis>) => void;
  skapaObservation: (observation: Omit<Observation, 'id'>) => Observation;
  uppdateraObservation: (id: string, patch: Partial<Observation>) => void;
  skapaPrincip: (spelomradeId: SpelomradeId, princip: Omit<Princip, 'id'>) => Princip;
  uppdateraPrincip: (spelomradeId: SpelomradeId, principId: string, patch: Partial<Princip>) => void;
  resetTillSeed: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => load());
  const [roll, setRoll] = useState<Roll>('huvudtranare');
  const [aktivtUppdragId, setAktivtUppdragId] = useState<string | null>(null);
  const [aktivtMatchbevisId, setAktivtMatchbevisId] = useState<string | null>(null);

  useEffect(() => {
    save(state);
  }, [state]);

  const setAktivtLarstegId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, aktivtLarstegId: id }));
  }, []);

  const uppdateraLarsteg = useCallback((id: string, patch: Partial<Larsteg>) => {
    setState((prev) => ({
      ...prev,
      larsteg: prev.larsteg.map((steg) => (steg.id === id ? { ...steg, ...patch } : steg)),
    }));
  }, []);

  const uppdateraIdentitet = useCallback((id: string, patch: Partial<Identitet>) => {
    setState((prev) => ({
      ...prev,
      identiteter: prev.identiteter.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    }));
  }, []);

  const skapaUppdrag = useCallback((uppdrag: Omit<Traneruppdrag, 'id'>) => {
    const nytt: Traneruppdrag = { ...uppdrag, id: nyId('uppdrag') };
    setState((prev) => ({
      ...prev,
      uppdrag: [...prev.uppdrag, nytt],
      larsteg: prev.larsteg.map((steg) =>
        steg.id === nytt.larstegId ? { ...steg, uppdragIds: [...steg.uppdragIds, nytt.id] } : steg,
      ),
    }));
    return nytt;
  }, []);

  const uppdateraUppdrag = useCallback((id: string, patch: Partial<Traneruppdrag>) => {
    setState((prev) => {
      const befintlig = prev.uppdrag.find((u) => u.id === id);
      const larstegByttes =
        befintlig !== undefined && patch.larstegId !== undefined && patch.larstegId !== befintlig.larstegId;
      return {
        ...prev,
        uppdrag: prev.uppdrag.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        larsteg: larstegByttes
          ? prev.larsteg.map((steg) => {
              if (steg.id === befintlig!.larstegId) {
                return { ...steg, uppdragIds: steg.uppdragIds.filter((x) => x !== id) };
              }
              if (steg.id === patch.larstegId) {
                return { ...steg, uppdragIds: [...steg.uppdragIds, id] };
              }
              return steg;
            })
          : prev.larsteg,
      };
    });
  }, []);

  const skapaMatchbevis = useCallback((bevis: Omit<Matchbevis, 'id'>) => {
    const nytt: Matchbevis = { ...bevis, id: nyId('matchbevis') };
    setState((prev) => ({
      ...prev,
      matchbevis: [...prev.matchbevis, nytt],
      larsteg: prev.larsteg.map((steg) =>
        steg.id === nytt.larstegId ? { ...steg, matchbevisIds: [...steg.matchbevisIds, nytt.id] } : steg,
      ),
    }));
    return nytt;
  }, []);

  const uppdateraMatchbevis = useCallback((id: string, patch: Partial<Matchbevis>) => {
    setState((prev) => {
      const befintligt = prev.matchbevis.find((m) => m.id === id);
      const larstegByttes =
        befintligt !== undefined && patch.larstegId !== undefined && patch.larstegId !== befintligt.larstegId;
      return {
        ...prev,
        matchbevis: prev.matchbevis.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        larsteg: larstegByttes
          ? prev.larsteg.map((steg) => {
              if (steg.id === befintligt!.larstegId) {
                return { ...steg, matchbevisIds: steg.matchbevisIds.filter((x) => x !== id) };
              }
              if (steg.id === patch.larstegId) {
                return { ...steg, matchbevisIds: [...steg.matchbevisIds, id] };
              }
              return steg;
            })
          : prev.larsteg,
      };
    });
  }, []);

  const skapaObservation = useCallback((observation: Omit<Observation, 'id'>) => {
    const ny: Observation = { ...observation, id: nyId('observation') };
    setState((prev) => ({ ...prev, observationer: [...prev.observationer, ny] }));
    return ny;
  }, []);

  const uppdateraObservation = useCallback((id: string, patch: Partial<Observation>) => {
    setState((prev) => ({
      ...prev,
      observationer: prev.observationer.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }));
  }, []);

  const skapaPrincip = useCallback((spelomradeId: SpelomradeId, princip: Omit<Princip, 'id'>) => {
    const ny: Princip = { ...princip, id: nyId('princip') };
    setState((prev) => ({
      ...prev,
      spelomraden: prev.spelomraden.map((s) =>
        s.id === spelomradeId ? { ...s, principer: [...s.principer, ny] } : s,
      ),
    }));
    return ny;
  }, []);

  const uppdateraPrincip = useCallback(
    (spelomradeId: SpelomradeId, principId: string, patch: Partial<Princip>) => {
      setState((prev) => ({
        ...prev,
        spelomraden: prev.spelomraden.map((s) =>
          s.id === spelomradeId
            ? { ...s, principer: s.principer.map((p) => (p.id === principId ? { ...p, ...patch } : p)) }
            : s,
        ),
      }));
    },
    [],
  );

  const resetTillSeed = useCallback(() => {
    setState(resetRepository());
  }, []);

  const value: AppStateContextValue = {
    state,
    roll,
    setRoll,
    setAktivtLarstegId,
    aktivtUppdragId,
    setAktivtUppdragId,
    aktivtMatchbevisId,
    setAktivtMatchbevisId,
    uppdateraLarsteg,
    uppdateraIdentitet,
    skapaUppdrag,
    uppdateraUppdrag,
    skapaMatchbevis,
    uppdateraMatchbevis,
    skapaObservation,
    uppdateraObservation,
    skapaPrincip,
    uppdateraPrincip,
    resetTillSeed,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState måste användas inom AppStateProvider');
  return ctx;
}
