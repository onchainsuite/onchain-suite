import { describe, expect, it } from "vitest";

import {
  buildProtocolAutomation,
  buildTemplateGraph,
  type ProtocolTemplate,
  protocolTemplateFamilies,
  protocolTemplates,
  protocolTemplatesByFamily,
} from "./protocol-templates";

describe("protocol templates catalog", () => {
  it("covers every advertised family with at least one template", () => {
    for (const family of protocolTemplateFamilies) {
      expect(protocolTemplatesByFamily(family.id).length).toBeGreaterThan(0);
    }
  });

  it("gives every template a unique id and exactly one trigger", () => {
    const ids = new Set<string>();
    for (const t of protocolTemplates) {
      expect(ids.has(t.id)).toBe(false);
      ids.add(t.id);
      const triggers = t.steps.filter((s) => s.kind === "trigger");
      expect(triggers).toHaveLength(1);
      // trigger must be the first step
      expect(t.steps[0]?.kind).toBe("trigger");
    }
  });
});

describe("buildTemplateGraph", () => {
  const linear = protocolTemplates.find(
    (t) => t.id === "bridge-welcome-series"
  )!;

  it("produces a node per linear step and connects them sequentially", () => {
    const graph = buildTemplateGraph(linear, 1);
    expect(graph.nodes).toHaveLength(linear.steps.length);
    // one fewer edge than nodes for a purely linear flow
    expect(graph.edges).toHaveLength(linear.steps.length - 1);

    // first node is the trigger
    expect(graph.nodes[0].type).toBe("trigger");

    // every edge references real nodes
    const nodeIds = new Set(graph.nodes.map((n) => n.id));
    for (const edge of graph.edges) {
      expect(nodeIds.has(edge.source)).toBe(true);
      expect(nodeIds.has(edge.target)).toBe(true);
    }

    // node ids are unique
    expect(nodeIds.size).toBe(graph.nodes.length);
  });

  it("fans a branch into yes/no paths with handle-tagged edges", () => {
    const branching = protocolTemplates.find(
      (t) => t.id === "airdrop-eligibility-notice"
    )!;
    const graph = buildTemplateGraph(branching, 2);

    const branchNode = graph.nodes.find((n) => n.type === "branch");
    expect(branchNode).toBeDefined();

    const yesEdge = graph.edges.find((e) => e.sourceHandle === "yes");
    const noEdge = graph.edges.find((e) => e.sourceHandle === "no");
    expect(yesEdge?.source).toBe(branchNode!.id);
    expect(noEdge?.source).toBe(branchNode!.id);

    // yes/no edges are color-coded distinctly
    expect(yesEdge!.style.stroke).not.toBe(noEdge!.style.stroke);
  });

  it("is deterministic for a given seed", () => {
    const a = buildTemplateGraph(linear, 7);
    const b = buildTemplateGraph(linear, 7);
    expect(a).toEqual(b);
  });
});

describe("buildProtocolAutomation", () => {
  it("creates a POST /automations body with trigger + builder graph", () => {
    const template = protocolTemplates[0] as ProtocolTemplate;
    const body = buildProtocolAutomation(template, 3);

    expect(body.name).toBe(template.name);
    expect(body.description).toBe(template.description);
    expect(body.trigger).toMatchObject({
      type: expect.any(String),
      event: expect.any(String),
    });

    const builder = body.builder as { nodes: unknown[]; edges: unknown[] };
    expect(Array.isArray(builder.nodes)).toBe(true);
    expect(builder.nodes.length).toBeGreaterThan(0);
    expect(body.flowGraph).toEqual(body.builder);
  });
});
