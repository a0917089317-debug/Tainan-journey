// BYOK: each visitor's OpenAI key lives only in their own browser and is sent
// to our API in this header on each request.
export const OPENAI_KEY_HEADER = "x-openai-key";

const STORAGE_KEY = "tainan-journey:openai-key";
const listeners = new Set<() => void>();

export function getOpenAIKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setOpenAIKey(key: string) {
  try {
    if (key) localStorage.setItem(STORAGE_KEY, key);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked (private mode etc.) — the key just won't persist.
  }
  listeners.forEach((notify) => notify());
}

// For useSyncExternalStore; also picks up changes from other tabs.
export function subscribeOpenAIKey(notify: () => void) {
  listeners.add(notify);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", onStorage);
  };
}

export function maskKey(key: string) {
  return key.length > 8 ? `${key.slice(0, 3)}…${key.slice(-4)}` : "••••";
}
