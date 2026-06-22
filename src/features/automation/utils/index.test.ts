import type { Edge, Node } from "reactflow";
import { describe, expect, it } from "vitest";

import { isValidConnection } from "./index";

const nodes: Node[] = [
  {
    id: "trigger-1",
    type: "trigger",
    position: { x: 0, y: 0 },
    data: { label: "Trigger" },
  },
  {
    id: "wait-1",
    type: "wait",
    position: { x: 0, y: 100 },
    data: { label: "Wait" },
  },
  {
    id: "placeholder-1",
    type: "placeholder",
    position: { x: 0, y: 200 },
    data: { label: "Placeholder" },
  },
];

describe("isValidConnection", () => {
  it("accepts a real builder connection between existing nodes", () => {
    expect(
      isValidConnection(
        {
          source: "trigger-1",
          target: "wait-1",
          sourceHandle: null,
          targetHandle: null,
        },
        nodes
      )
    ).toEqual({ valid: true, message: "Valid connection" });
  });

  it("rejects duplicate edges and placeholder targets", () => {
    const edges: Edge[] = [
      {
        id: "edge-1",
        source: "trigger-1",
        target: "wait-1",
      },
    ];

    expect(
      isValidConnection(
        {
          source: "trigger-1",
          target: "wait-1",
          sourceHandle: null,
          targetHandle: null,
        },
        nodes,
        edges
      )
    ).toEqual({
      valid: false,
      message: "These nodes are already connected",
    });

    expect(
      isValidConnection(
        {
          source: "wait-1",
          target: "placeholder-1",
          sourceHandle: null,
          targetHandle: null,
        },
        nodes
      )
    ).toEqual({
      valid: false,
      message: "Use the placeholder action picker instead",
    });
  });
});
