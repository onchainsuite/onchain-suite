import { afterEach } from "vitest";

const isDom = typeof window !== "undefined" && typeof document !== "undefined";

if (isDom) {
  import("@testing-library/jest-dom/vitest");
  import("@testing-library/react").then(({ cleanup }) => {
    afterEach(() => cleanup());
  });
}
