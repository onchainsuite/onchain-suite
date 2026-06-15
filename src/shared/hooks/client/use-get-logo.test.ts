import { describe, expect, it } from "vitest";

import { readBrandingData } from "./use-get-logo";

describe("readBrandingData", () => {
  it("prefers logoPreview URLs from the branding response", () => {
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
      primary: "/logos/primary.png",
      dark: "/logos/dark.png",
      favicon: "/logos/favicon.png",
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
      primary: "/legacy-primary.png",
      dark: "/legacy-dark.png",
      favicon: "/legacy-favicon.png",
    });
  });
});
