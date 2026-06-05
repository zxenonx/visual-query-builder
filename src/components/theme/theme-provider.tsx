"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

/** Accent swatch options (from the handoff token spec). */
export const ACCENTS = [
  "#7c3aed", // violet (default — vibrant/playful)
  "#4f46e5", // indigo
  "#2563eb", // blue
  "#0d9488", // teal
  "#d97706", // amber
  "#e11d48", // rose
  "#18181b", // graphite
] as const;

export const THEME_KEY = "qb_theme_v1";
export const ACCENT_KEY = "qb_accent_v1";
const DEFAULT_ACCENT = ACCENTS[0];

type ThemeState = { theme: Theme; accent: string };

/* ── External store ──────────────────────────────────────────────────────────
   Theme/accent live outside React (localStorage + the document element) so the
   pre-paint inline script and React stay in sync. useSyncExternalStore reads it
   without a setState-in-effect, and renders the server snapshot during hydration
   to avoid a mismatch. */

const SERVER_STATE: ThemeState = { theme: "light", accent: DEFAULT_ACCENT };
let state: ThemeState = SERVER_STATE;
let hydrated = false;
const listeners = new Set<() => void>();

function applyTheme(theme: Theme) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
}
function applyAccent(accent: string) {
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty("--accent", accent);
  }
}

function readFromStorage(): ThemeState {
  try {
    const theme =
      (localStorage.getItem(THEME_KEY) as Theme | null) ??
      (window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
        ? "dark"
        : "light");
    const accent = localStorage.getItem(ACCENT_KEY) ?? DEFAULT_ACCENT;
    return { theme, accent };
  } catch {
    return SERVER_STATE;
  }
}

function getSnapshot(): ThemeState {
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    state = readFromStorage();
  }
  return state;
}
function getServerSnapshot(): ThemeState {
  return SERVER_STATE;
}
function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function emit() {
  for (const l of listeners) l();
}

function commit(next: ThemeState) {
  state = next;
  emit();
}

/** Test-only: reset the module store between tests. */
export function __resetThemeStore() {
  state = SERVER_STATE;
  hydrated = false;
}

/* ── Context ─────────────────────────────────────────────────────────────── */

type ThemeContextValue = {
  theme: Theme;
  accent: string;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setAccent: (a: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setTheme = useCallback((theme: Theme) => {
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
    commit({ ...state, theme });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(state.theme === "dark" ? "light" : "dark");
  }, [setTheme]);

  const setAccent = useCallback((accent: string) => {
    applyAccent(accent);
    try {
      localStorage.setItem(ACCENT_KEY, accent);
    } catch {}
    commit({ ...state, accent });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: snapshot.theme,
      accent: snapshot.accent,
      setTheme,
      toggleTheme,
      setAccent,
    }),
    [snapshot, setTheme, toggleTheme, setAccent],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

/**
 * Inline script that applies the persisted theme/accent before first paint to
 * avoid a flash of the wrong theme. Rendered in <head> via the root layout.
 */
export const themeInitScript = `
(function () {
  try {
    var t = localStorage.getItem('${THEME_KEY}');
    if (!t) t = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
    var a = localStorage.getItem('${ACCENT_KEY}');
    if (a) document.documentElement.style.setProperty('--accent', a);
  } catch (e) {}
})();
`;
