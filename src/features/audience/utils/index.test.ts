import { describe, expect, it } from "vitest";

import {
  deriveDisplayName,
  extractWalletFields,
  hashHue,
  normalizeTags,
  shortenWallet,
} from ".";

describe("audience utils", () => {
  it("normalizes tags from strings and objects", () => {
    expect(normalizeTags(["vip", { name: "newsletter" }, { id: "x" }])).toEqual(
      ["vip", "newsletter", "x"]
    );
    expect(normalizeTags([{ name: "  " }, null, 1])).toEqual([]);
  });

  it("shortens wallet addresses", () => {
    expect(shortenWallet("")).toBe("");
    expect(shortenWallet("0x1234")).toBe("0x1234");
    expect(shortenWallet("0x1234567890abcdef1234567890abcdef12345678")).toBe(
      "0x1234…5678"
    );
  });

  it("extracts wallet fields from different shapes", () => {
    expect(
      extractWalletFields({
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      })
    ).toEqual({
      walletFull: "0x1234567890abcdef1234567890abcdef12345678",
      wallet: "0x1234…5678",
    });
    expect(extractWalletFields({ wallet: { address: "0xabc" } })).toEqual({
      walletFull: "0xabc",
      wallet: "0xabc",
    });
    expect(extractWalletFields({ wallets: [{ address: "0xdef" }] })).toEqual({
      walletFull: "0xdef",
      wallet: "0xdef",
    });
  });

  it("derives a display name from name/email/wallet", () => {
    expect(
      deriveDisplayName({ name: "Alice Smith", email: "alice@example.com" })
    ).toBe("Alice Smith");
    expect(deriveDisplayName({ email: "lucas.martin@example.com" })).toBe(
      "Lucas Martin"
    );
    expect(
      deriveDisplayName({
        email: "x@example.com",
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      })
    ).toBe("X");
  });

  it("hashes a string to a stable hue", () => {
    const a = hashHue("abc");
    const b = hashHue("abc");
    expect(a).toBe(b);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThan(360);
  });
});
