import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { readBrandingData } from "./use-get-logo";

describe("readBrandingData", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_URL", "http://backend.test/api/v1");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers logoPreview URLs and resolves backend-relative paths", () => {
    expect(
      readBrandingData({
        success: true,
        data: {
          logoPreview: {
            primaryUrl: "/logos/primary.png",
            darkUrl: "/logos/dark.png",
            faviconUrl: "/logos/favicon.png",
          },
          primaryLogo: "/legacy-primary.png",
          darkModeLogo: "/legacy-dark.png",
        },
      })
    ).toEqual({
      primary: "http://backend.test/logos/primary.png",
      dark: "http://backend.test/logos/dark.png",
      favicon: "http://backend.test/logos/favicon.png",
    });
  });

  it("falls back to legacy branding fields when logoPreview is absent", () => {
    expect(
      readBrandingData({
        success: true,
        data: {
          primaryLogo: "/legacy-primary.png",
          darkModeLogo: "/legacy-dark.png",
          favicon: "/legacy-favicon.png",
        },
      })
    ).toEqual({
      primary: "http://backend.test/legacy-primary.png",
      dark: "http://backend.test/legacy-dark.png",
      favicon: "http://backend.test/legacy-favicon.png",
    });
  });

  it("passes absolute URLs through untouched", () => {
    expect(
      readBrandingData({
        success: true,
        data: {
          logoPreview: {
            primaryUrl: "https://cdn.example.com/logos/primary.png",
          },
        },
      })
    ).toEqual({
      primary: "https://cdn.example.com/logos/primary.png",
      dark: undefined,
      favicon: undefined,
    });
  });
});
