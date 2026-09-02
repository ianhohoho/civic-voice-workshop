const SESSION_KEY = "civic-voice-session";

function defaultStorage() {
  return globalThis.localStorage;
}

export function loadSession(storage = defaultStorage()) {
  if (!storage) return null;

  try {
    const savedSession = storage.getItem(SESSION_KEY);
    return savedSession ? JSON.parse(savedSession) : null;
  } catch {
    storage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveSession(session, storage = defaultStorage()) {
  if (!storage) return;
  storage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(storage = defaultStorage()) {
  storage?.removeItem(SESSION_KEY);
}
