import { type Connection, type Edge, type Node } from "reactflow";

// Connection validation
export const isValidConnection = (
  connection: Connection,
  nodes: Node[]
): { valid: boolean; message: string } => {
  const sourceNode = nodes.find((n) => n.id === connection.source);
  const targetNode = nodes.find((n) => n.id === connection.target);
  if (sourceNode || targetNode)
    return { valid: false, message: "Invalid nodes" };
  if (connection.source === connection.target)
    return { valid: false, message: "Cannot connect to self" };
  if (
    targetNode &&
    (targetNode as unknown as { type: string }).type === "trigger"
  )
    return { valid: false, message: "Triggers can only be starting points" };
  if (
    sourceNode &&
    (sourceNode as unknown as { type: string }).type === "placeholder"
  )
    return { valid: false, message: "Replace placeholder first" };
  return { valid: true, message: "Valid connection" };
};

// Get automation data based on ID
export const getAutomationData = (id: string) => {
  const isNew = id === "new-id";
  return {
    id,
    name: isNew ? "New Automation" : "Win-back Cooling Pudgy Holders",
    description: isNew
      ? ""
      : "Re-engage your users who held Pudgy Penguins but went inactive",
    status: isNew ? "draft" : "active",
    reach: isNew ? 0 : 714,
    entries: isNew ? 0 : 1247,
    conversions: isNew ? 0 : 342,
    conversionRate: isNew ? 0 : 27.6,
    revenue: isNew ? 0 : 127000,
    createdAt: isNew ? "Just now" : "Oct 15, 2024",
    lastTriggered: isNew ? "Never" : "2h ago",
  };
};

export const autoLayoutNodes = (
  nodes: Node[],

  _newNode: Node
): { x: number; y: number } => {
  if (nodes.length === 0) return { x: 400, y: 50 };

  // Find the lowest node
  const lowestNode = nodes.reduce(
    (lowest, node) => (node.position.y > lowest.position.y ? node : lowest),
    nodes[0]
  );

  // Position new node below the lowest with offset
  return {
    x: lowestNode.position.x,
    y: lowestNode.position.y + 150,
  };
};

export const getInitialNodes = (id: string): Node[] => {
  if (id === "new-id") {
    // Pre-load example flow for new automations
    return [
      {
        id: "trigger-1",
        type: "trigger",
        position: { x: 400, y: 50 },
        data: {
          label: "Your users: Pudgy transfer",
          contract: "Pudgy Penguins",
          event: "Transfer",
          chain: "Ethereum",
          preview: "Matches ~714 of your users",
        },
      },
      {
        id: "wait-1",
        type: "wait",
        position: { x: 400, y: 200 },
        data: { label: "Wait", duration: "3 days" },
      },
      {
        id: "branch-1",
        type: "branch",
        position: { x: 400, y: 350 },
        data: { label: "Check engagement", condition: "engagement_score" },
      },
      {
        id: "email-1",
        type: "email",
        position: { x: 250, y: 520 },
        data: {
          label: "Send win-back",
          template: "Win-back Campaign",
          subject: "We miss you, vitalik.eth",
        },
      },
      {
        id: "placeholder-1",
        type: "placeholder",
        position: { x: 550, y: 520 },
        data: { label: "Add action for Warm" },
      },
    ];
  }
  return [
    {
      id: "1",
      type: "trigger",
      position: { x: 400, y: 50 },
      data: {
        label: "Your users: Pudgy transfer",
        contract: "Pudgy Penguins",
        event: "Transfer",
        chain: "Ethereum",
        preview: "Matches ~714 of your users",
      },
    },
    {
      id: "2",
      type: "wait",
      position: { x: 400, y: 200 },
      data: { label: "Wait", duration: "3 days" },
    },
    {
      id: "3",
      type: "branch",
      position: { x: 400, y: 350 },
      data: { label: "Check engagement", condition: "engagement_score" },
    },
    {
      id: "4",
      type: "email",
      position: { x: 250, y: 520 },
      data: {
        label: "Send win-back",
        template: "Win-back Campaign",
        subject: "We miss you, vitalik.eth",
      },
    },
    {
      id: "5",
      type: "placeholder",
      position: { x: 550, y: 520 },
      data: { label: "Add action for Warm" },
    },
  ];
};

export const getInitialEdges = (id: string): Edge[] => {
  if (id === "new-id") {
    // Pre-load example edges for new automations
    return [
      { id: "e1", source: "trigger-1", target: "wait-1" },
      { id: "e2", source: "wait-1", target: "branch-1" },
      { id: "e3", source: "branch-1", target: "email-1", sourceHandle: "yes" },
      {
        id: "e4",
        source: "branch-1",
        target: "placeholder-1",
        sourceHandle: "no",
        animated: true,
        style: { strokeDasharray: "5,5" },
      },
    ];
  }
  return [
    { id: "e1", source: "1", target: "2" },
    { id: "e2", source: "2", target: "3" },
    { id: "e3", source: "3", target: "4", sourceHandle: "yes" },
    {
      id: "e4",
      source: "3",
      target: "5",
      sourceHandle: "no",
      animated: true,
      style: { strokeDasharray: "5,5" },
    },
  ];
};
