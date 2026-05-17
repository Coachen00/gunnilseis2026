export const SHARED_LOGIN_EMAIL = "gunnilse@gunnilse.se";
export const LEGACY_SHARED_LOGIN_EMAIL = "gunnilse2026@gunnilse.se";

const SHARED_LOGIN_ALIASES = new Set([
  "gunnilse",
  "gunnilse2026",
  SHARED_LOGIN_EMAIL,
  LEGACY_SHARED_LOGIN_EMAIL,
]);

export const normalizeLogin = (value: string) => value.trim().toLowerCase();

export const isSharedLogin = (value: string) => {
  const normalized = normalizeLogin(value);
  return SHARED_LOGIN_ALIASES.has(normalized);
};

export const toSupabaseEmail = (value: string) => {
  const normalized = normalizeLogin(value);

  if (isSharedLogin(normalized)) {
    return SHARED_LOGIN_EMAIL;
  }

  return normalized.includes("@")
    ? normalized
    : `${normalized}@gunnilse.local`;
};

export const getLoginEmailCandidates = (value: string) => {
  const primary = toSupabaseEmail(value);

  if (!isSharedLogin(value)) {
    return [primary];
  }

  return Array.from(new Set([primary, LEGACY_SHARED_LOGIN_EMAIL]));
};
