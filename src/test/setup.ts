import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  // reset persisted state between tests
  try {
    localStorage.clear();
  } catch {}
});
