import { afterEach, describe, expect, it, vi } from "vitest";

import { openCheckoutInNewTab } from "./checkout";

const PAYMENT_URL = "https://pay.example.com/checkout/abc123";

/** Minimal stand-in for the WindowProxy returned by window.open. */
const makeWindowStub = () => ({
  opener: {} as unknown,
  location: { replace: vi.fn() },
  close: vi.fn(),
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("openCheckoutInNewTab", () => {
  it("reports success when the tab opens, so callers do not also navigate the current tab", () => {
    const stub = makeWindowStub();
    const openSpy = vi
      .spyOn(window, "open")
      .mockReturnValue(stub as unknown as Window);

    expect(openCheckoutInNewTab(PAYMENT_URL)).toBe(true);
    expect(stub.location.replace).toHaveBeenCalledWith(PAYMENT_URL);
    expect(openSpy).toHaveBeenCalledTimes(1);
  });

  it("never passes noopener to window.open (it forces a null return, which read as 'blocked' and opened a second tab)", () => {
    const stub = makeWindowStub();
    const openSpy = vi
      .spyOn(window, "open")
      .mockReturnValue(stub as unknown as Window);

    openCheckoutInNewTab(PAYMENT_URL);

    const features = openSpy.mock.calls[0]?.[2];
    expect(String(features ?? "")).not.toContain("noopener");
  });

  it("severs the opener reference before navigating (reverse-tabnabbing guard)", () => {
    const stub = makeWindowStub();
    vi.spyOn(window, "open").mockReturnValue(stub as unknown as Window);

    openCheckoutInNewTab(PAYMENT_URL);

    expect(stub.opener).toBeNull();
  });

  it("returns false when a popup blocker returns null", () => {
    vi.spyOn(window, "open").mockReturnValue(null);

    expect(openCheckoutInNewTab(PAYMENT_URL)).toBe(false);
  });

  it("closes the blank tab and returns false when navigation throws", () => {
    const stub = makeWindowStub();
    stub.location.replace.mockImplementation(() => {
      throw new Error("navigation blocked");
    });
    vi.spyOn(window, "open").mockReturnValue(stub as unknown as Window);

    expect(openCheckoutInNewTab(PAYMENT_URL)).toBe(false);
    expect(stub.close).toHaveBeenCalledTimes(1);
  });
});
