import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  __resetThemeStore,
  ThemeProvider,
  THEME_KEY,
  useTheme,
} from "./theme-provider";

beforeEach(() => {
  __resetThemeStore();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.style.removeProperty("--accent");
});

function Probe() {
  const { theme, toggleTheme, accent, setAccent } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="accent">{accent}</span>
      <button onClick={toggleTheme}>toggle</button>
      <button onClick={() => setAccent("#e11d48")}>rose</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  it("defaults to light and exposes the default accent", () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(screen.getByTestId("accent")).toHaveTextContent("#7c3aed");
  });

  it("toggles theme, sets data-theme, and persists", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    await user.click(screen.getByText("toggle"));
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  });

  it("applies a chosen accent to the document and persists it", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    await user.click(screen.getByText("rose"));
    expect(screen.getByTestId("accent")).toHaveTextContent("#e11d48");
    expect(
      document.documentElement.style.getPropertyValue("--accent"),
    ).toBe("#e11d48");
  });
});
