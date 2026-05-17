import { isSharedLogin, SHARED_LOGIN_EMAIL } from "./sharedLogin";

const SHARED_ACCESS_KEY = "gunnilse_shared_access_v1";
const SHARED_ACCESS_EVENT = "gunnilse-shared-access-change";
const SHARED_PASSWORD_SHA256 = "b6d208cdd1ec3ec07a296a5bc88aa377a304871ba393273fe1f3c0e1fdf262ba";

type StoredSharedAccess = {
  active: true;
  email: string;
  createdAt: string;
};

export type SharedAccessUser = {
  id: "shared-gunnilse-login";
  email: string;
  displayName: string;
};

const canUseStorage = () => typeof window !== "undefined" && "localStorage" in window;

const emitSharedAccessChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SHARED_ACCESS_EVENT));
  }
};

const sha256 = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const isSharedAccessCredential = async (username: string, password: string) => {
  if (!isSharedLogin(username) || typeof crypto === "undefined" || !crypto.subtle) {
    return false;
  }

  return (await sha256(password)) === SHARED_PASSWORD_SHA256;
};

export const setSharedAccessActive = () => {
  if (!canUseStorage()) return;

  const payload: StoredSharedAccess = {
    active: true,
    email: SHARED_LOGIN_EMAIL,
    createdAt: new Date().toISOString(),
  };

  window.localStorage.setItem(SHARED_ACCESS_KEY, JSON.stringify(payload));
  emitSharedAccessChange();
};

export const clearSharedAccess = () => {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(SHARED_ACCESS_KEY);
  emitSharedAccessChange();
};

export const getSharedAccessUser = (): SharedAccessUser | null => {
  if (!canUseStorage()) return null;

  try {
    const stored = window.localStorage.getItem(SHARED_ACCESS_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Partial<StoredSharedAccess>;
    if (parsed.active !== true || parsed.email !== SHARED_LOGIN_EMAIL) {
      return null;
    }

    return {
      id: "shared-gunnilse-login",
      email: SHARED_LOGIN_EMAIL,
      displayName: "Gunnilse",
    };
  } catch {
    clearSharedAccess();
    return null;
  }
};

export const subscribeSharedAccess = (listener: () => void) => {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(SHARED_ACCESS_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(SHARED_ACCESS_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
};
