import { describe, expect, it } from "vitest";
import { clearSession, loadSession, saveSession } from "./sessionStorage";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

describe("session storage", () => {
  it("restores a saved session", () => {
    const storage = memoryStorage();
    const session = { token: "demo-token", user: { role: "citizen", name: "Aisha Rahman" } };

    saveSession(session, storage);

    expect(loadSession(storage)).toEqual(session);
  });

  it("clears the saved session on sign out", () => {
    const storage = memoryStorage();
    saveSession({ token: "demo-token" }, storage);

    clearSession(storage);

    expect(loadSession(storage)).toBeNull();
  });

  it("ignores invalid saved data", () => {
    const storage = memoryStorage();
    storage.setItem("civic-voice-session", "not-json");

    expect(loadSession(storage)).toBeNull();
  });
});
