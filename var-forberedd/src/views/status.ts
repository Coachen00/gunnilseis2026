import type { MatchbevisTyp, MatchbevisUtfall, Status } from '../domain/types';

export const STATUS_VALUES: Status[] = [
  'Ej påbörjat',
  'Pågår',
  'Delvis förstått',
  'Visat i träning',
  'Visat i match',
  'Etablerat',
];

export const MATCHBEVIS_TYP_VALUES: MatchbevisTyp[] = ['match', 'träningsmatch', 'träning'];

export const MATCHBEVIS_UTFALL_VALUES: MatchbevisUtfall[] = ['uppnått', 'delvis', 'ej uppnått', '—'];

export type StatusBucket = 'ej-paborjat' | 'pagar' | 'etablerat';

export function statusBucket(status: Status): StatusBucket {
  if (status === 'Etablerat') return 'etablerat';
  if (status === 'Ej påbörjat') return 'ej-paborjat';
  return 'pagar';
}

export function statusPillClass(status: Status): string {
  return `pill status-pill status-pill--${statusBucket(status)}`;
}

export type UtfallBucket = 'uppnatt' | 'delvis' | 'ej-uppnatt' | 'ingen';

export function utfallBucket(utfall: MatchbevisUtfall): UtfallBucket {
  if (utfall === 'uppnått') return 'uppnatt';
  if (utfall === 'delvis') return 'delvis';
  if (utfall === 'ej uppnått') return 'ej-uppnatt';
  return 'ingen';
}

export function utfallBadgeClass(utfall: MatchbevisUtfall): string {
  return `pill utfall-badge utfall-badge--${utfallBucket(utfall)}`;
}
