import { describe, expect, it } from "vitest";

import { extractEmailContent } from "./utils";

describe("extractEmailContent", () => {
  it("finds rendered html/text inside nested content wrappers", () => {
    const extracted = extractEmailContent({
      data: {
        payload: {
          content: {
            html: "<div>Hello</div>",
            text: "Hello",
          },
          design: { blocks: [{ id: "x" }] },
          assets: [{ id: "asset-1" }],
        },
      },
    });

    expect(extracted).toEqual({
      html: "<div>Hello</div>",
      textVersion: "Hello",
      json: { blocks: [{ id: "x" }] },
      assets: [{ id: "asset-1" }],
      previewUrl: undefined,
    });
  });

  it("finds preview assets nested inside template content", () => {
    const extracted = extractEmailContent({
      content: {
        previewURL: "https://cdn.example.com/preview.png",
      },
    });

    expect(extracted.previewUrl).toBe("https://cdn.example.com/preview.png");
  });
});
