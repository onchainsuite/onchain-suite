import { describe, expect, it } from "vitest";

import {
  buildTriggerContractPatch,
  resolveContractCatalog,
} from "./contracts";

describe("automation contract helpers", () => {
  it("prefers saved project settings contracts over fallback mock contracts", () => {
    const catalog = resolveContractCatalog(
      [
        {
          chain: "Ethereum",
          address: "0x1234567890abcdef",
          label: "Rewards Contract",
        },
      ],
      [
        {
          chain: "Base",
          address: "0xfallback",
          name: "Fallback Contract",
        },
      ]
    );

    expect(catalog).toEqual([
      {
        chain: "Ethereum",
        address: "0x1234567890abcdef",
        name: "Rewards Contract",
      },
    ]);
  });

  it("falls back to mock contracts when project settings do not expose live contracts", () => {
    const fallback = [
      {
        chain: "Base",
        address: "0xfallback",
        name: "Fallback Contract",
      },
    ];

    expect(resolveContractCatalog([], fallback)).toEqual(fallback);
    expect(resolveContractCatalog(undefined, fallback)).toEqual(fallback);
  });

  it("builds the trigger patch from a selected live contract", () => {
    const patch = buildTriggerContractPatch("0x1234567890abcdef", [
      {
        chain: "Ethereum",
        address: "0x1234567890abcdef",
        name: "Rewards Contract",
      },
    ]);

    expect(patch).toEqual({
      contract: "Rewards Contract",
      contractAddress: "0x1234567890abcdef",
      chain: "Ethereum",
    });
  });

  it("preserves the selected address even when the catalog entry is missing", () => {
    expect(buildTriggerContractPatch("0xmissing", [])).toEqual({
      contract: "0xmissing",
      contractAddress: "0xmissing",
      chain: "",
    });
  });
});
