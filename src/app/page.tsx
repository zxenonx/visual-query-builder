"use client";

import { ACCENTS, useTheme } from "@/components/theme/theme-provider";

const SURFACE_TOKENS = [
  { name: "bg", var: "--bg" },
  { name: "surface", var: "--surface" },
  { name: "surface-2", var: "--surface-2" },
  { name: "surface-3", var: "--surface-3" },
  { name: "border", var: "--border" },
  { name: "rail", var: "--rail" },
];

export default function Home() {
  const { theme, toggleTheme, accent, setAccent } = useTheme();

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <header className="flex w-full max-w-2xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="grid h-9 w-9 place-items-center rounded-[10px] font-bold"
            style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
            aria-hidden
          >
            ⌗
          </span>
          <div className="flex flex-col leading-tight">
            <b className="text-[15px] font-semibold tracking-tight">
              Visual Query Builder
            </b>
            <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>
              users · 120 records
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="h-9 rounded-[11px] px-3 text-[13px] font-medium transition-colors"
          style={{ background: "var(--surface-3)", color: "var(--text-dim)" }}
        >
          {theme === "dark" ? "☀ Light" : "☾ Dark"}
        </button>
      </header>

      <section
        className="flex w-full max-w-2xl flex-col gap-6 rounded-[18px] p-7"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Design system online
          </h1>
          <p className="text-[14px]" style={{ color: "var(--text-dim)" }}>
            Tokens, fonts (Space Grotesk + JetBrains Mono), light/dark theming, and
            the brand accent are wired up. The query builder UI lands in the next
            PRs.
          </p>
        </div>

        <code
          className="rounded-[11px] px-4 py-3 text-[12.5px]"
          style={{
            fontFamily: "var(--font-mono)",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        >
          SELECT * FROM users WHERE age &gt; 18 AND status = &apos;active&apos;;
        </code>

        <div className="flex flex-col gap-2">
          <span
            className="text-[11.5px] font-semibold uppercase tracking-wide"
            style={{ color: "var(--text-faint)" }}
          >
            Accent
          </span>
          <div className="flex flex-wrap gap-2">
            {ACCENTS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Set accent ${c}`}
                onClick={() => setAccent(c)}
                className="h-8 w-8 rounded-full transition-transform hover:scale-110"
                style={{
                  background: c,
                  outline: accent === c ? "2px solid var(--text)" : "none",
                  outlineOffset: 2,
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span
            className="text-[11.5px] font-semibold uppercase tracking-wide"
            style={{ color: "var(--text-faint)" }}
          >
            Surfaces
          </span>
          <div className="flex flex-wrap gap-2">
            {SURFACE_TOKENS.map((t) => (
              <div key={t.name} className="flex flex-col items-center gap-1">
                <div
                  className="h-10 w-14 rounded-[10px]"
                  style={{
                    background: `var(${t.var})`,
                    border: "1px solid var(--border-strong)",
                  }}
                />
                <span
                  className="text-[10px]"
                  style={{ color: "var(--text-faint)", fontFamily: "var(--font-mono)" }}
                >
                  {t.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
