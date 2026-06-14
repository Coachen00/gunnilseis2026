/**
 * Owner-grind för coach-privat material under /under-process.
 *
 * Sajten har ingen separat roll för "ägaren" i Supabase — owner-innehåll
 * gateras klient-sida på inloggningens e-post. Delade gunnilse-loginet ger
 * ingen Supabase-session och passerar därför aldrig denna check.
 */
export const OWNER_LOGIN = "leojsjoqvist";

export function isOwnerEmail(email: string | null | undefined): boolean {
  const normalized = email?.toLowerCase() ?? "";
  return normalized === OWNER_LOGIN || normalized.startsWith(`${OWNER_LOGIN}@`);
}
