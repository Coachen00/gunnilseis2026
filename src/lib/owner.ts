/**
 * Owner-grind för coach-privat material under /under-process.
 *
 * Owner-innehåll gateras klient-sida på den exakta Supabase-e-postadressen.
 * Delad åtkomst kan aldrig kvalificera eftersom den inte räknas som owner.
 */
export const OWNER_EMAIL = "leojsjoqvist@gmail.com";

export function isOwnerEmail(email: string | null | undefined): boolean {
  return email?.trim().toLowerCase() === OWNER_EMAIL;
}
