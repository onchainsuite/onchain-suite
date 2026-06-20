import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { QueryTab } from "./index";

const mocks = vi.hoisted(() => ({
  intelligenceService: {
    getSchema: vi.fn(),
    getQueryHistory: vi.fn(),
    getQueryStarters: vi.fn(),
    listQueryProtocols: vi.fn(),
    getQuerySuggestionsAnalytics: vi.fn(),
    validateQuery: vi.fn(),
    runQuery: vi.fn(),
    queryGoldrushMcp: vi.fn(),
    getQuerySuggestions: vi.fn(),
    generateSql: vi.fn(),
    getQueryStatus: vi.fn(),
    getQueryResults: vi.fn(),
    getQuerySummary: vi.fn(),
    saveQuery: vi.fn(),
    createSegmentFromQuery: vi.fn(),
    createCampaignFromQuery: vi.fn(),
  },
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: mocks.toast,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: { children?: ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
}));

vi.mock("@/ui/button", () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

vi.mock("@/ui/dialog", () => ({
  Dialog: ({
    open,
    children,
  }: {
    open?: boolean;
    children?: ReactNode;
    onOpenChange?: (open: boolean) => void;
  }) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("../../intelligence.service", () => ({
  intelligenceService: mocks.intelligenceService,
}));

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const renderQueryTab = (
  props?: Partial<React.ComponentProps<typeof QueryTab>>
) => {
  const queryClient = createQueryClient();
  const openEmailComposer = vi.fn();
  const setActiveTab = vi.fn();

  render(
    <QueryClientProvider client={queryClient}>
      <QueryTab
        activeSurface={props?.activeSurface ?? "sql"}
        openEmailComposer={props?.openEmailComposer ?? openEmailComposer}
        setActiveTab={props?.setActiveTab ?? setActiveTab}
      />
    </QueryClientProvider>
  );

  return {
    queryClient,
    openEmailComposer,
    setActiveTab,
  };
};

describe("QueryTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.intelligenceService.getSchema.mockResolvedValue({
      tables: [{ name: "users" }],
    });
    mocks.intelligenceService.getQueryHistory.mockResolvedValue([]);
    mocks.intelligenceService.getQueryStarters.mockResolvedValue({
      items: [
        {
          id: "starter_1",
          title: "Dormant users",
          description: "Find users inactive for 30 days",
          category: "Lifecycle",
          tags: ["winback"],
          query:
            "SELECT wallet, email FROM users WHERE last_active_days_ago > 30;",
        },
      ],
    });
    mocks.intelligenceService.listQueryProtocols.mockResolvedValue({
      items: [],
    });
    mocks.intelligenceService.getQuerySuggestionsAnalytics.mockResolvedValue({
      totals: {},
      topProtocols: [],
    });
    mocks.intelligenceService.validateQuery.mockResolvedValue({
      valid: true,
      suggestions: ["Looks good"],
    });
    mocks.intelligenceService.runQuery.mockResolvedValue({
      queryId: "query_123",
      status: "running",
      columns: [
        { name: "wallet" },
        { name: "email" },
        { name: "engagement_score" },
      ],
    });
    mocks.intelligenceService.getQueryStatus.mockResolvedValue({
      queryId: "query_123",
      status: "completed",
    });
    mocks.intelligenceService.getQueryResults.mockResolvedValue({
      rows: [
        {
          wallet: "0xabc",
          email: "holder@example.com",
          engagement_score: 97,
        },
      ],
      total: 1,
    });
    mocks.intelligenceService.getQuerySummary.mockResolvedValue({
      summary: "1 high-value row",
      winbackPotential: "High",
      score: 92,
    });
    mocks.intelligenceService.getQuerySuggestions.mockResolvedValue({
      suggestions: [
        {
          id: "idea_1",
          title: "Whales at risk",
          reason: "Targets high-value inactive users",
          tags: ["vip", "winback"],
          sqlDraft: "SELECT wallet FROM users WHERE engagement_score > 80;",
        },
      ],
    });
    mocks.intelligenceService.queryGoldrushMcp.mockResolvedValue({
      status: "answered",
      answer: "No MCP response needed for this SQL test.",
    });
    mocks.intelligenceService.generateSql.mockResolvedValue({
      sql: "SELECT wallet, email FROM users WHERE engagement_score > 80;",
      explanation: "Targets users with strong engagement.",
      warnings: ["Review the threshold before running."],
    });
    mocks.intelligenceService.saveQuery.mockResolvedValue({ success: true });
    mocks.intelligenceService.createSegmentFromQuery.mockResolvedValue({
      segmentId: "segment_123",
      profileCount: 1,
    });
    mocks.intelligenceService.createCampaignFromQuery.mockResolvedValue({
      campaignId: "campaign_123",
    });
  });

  it("runs a query, renders backend results, and forwards email actions", async () => {
    const { openEmailComposer } = renderQueryTab();

    fireEvent.change(screen.getByLabelText("SQL query editor"), {
      target: { value: "SELECT wallet, email FROM users LIMIT 1;" },
    });
    fireEvent.click(screen.getByRole("button", { name: /run/i }));

    await waitFor(() => {
      expect(mocks.intelligenceService.runQuery).toHaveBeenCalledTimes(1);
    });

    await screen.findByText("1 results");
    expect(screen.getByText("holder@example.com")).toBeInTheDocument();
    expect(screen.getByText("0xabc")).toBeInTheDocument();
    expect(screen.getByText(/Win-back potential:/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /email/i }));

    expect(openEmailComposer).toHaveBeenCalledWith({
      email: "holder@example.com",
    });
  });

  it("saves a report from query results through the backend service", async () => {
    const { setActiveTab } = renderQueryTab();

    fireEvent.change(screen.getByLabelText("SQL query editor"), {
      target: { value: "SELECT wallet, email FROM users LIMIT 1;" },
    });
    fireEvent.click(screen.getByRole("button", { name: /run/i }));
    await screen.findByRole("button", { name: /save report/i });

    fireEvent.click(screen.getByRole("button", { name: /save report/i }));
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Whales To Re-engage" },
    });
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(mocks.intelligenceService.saveQuery).toHaveBeenCalledWith(
        "query_123",
        { name: "Whales To Re-engage" }
      );
    });

    expect(mocks.toast.success).toHaveBeenCalledWith("Report saved");
    expect(setActiveTab).toHaveBeenCalledWith("reports");
  });

  it("loads starter queries into the editor", async () => {
    renderQueryTab();

    fireEvent.click(screen.getByRole("button", { name: /^Starter Queries$/i }));
    fireEvent.click(
      await screen.findByRole("button", { name: /Dormant users/i })
    );

    expect(screen.getByLabelText("SQL query editor")).toHaveValue(
      "SELECT wallet, email FROM users WHERE last_active_days_ago > 30;"
    );
  });

  it("generates SQL from a prompt and applies the draft to the editor", async () => {
    renderQueryTab();

    fireEvent.click(screen.getByRole("button", { name: /^Generate SQL$/i }));
    fireEvent.change(
      screen.getByPlaceholderText(
        "Find dormant high-value users with email addresses"
      ),
      {
        target: { value: "Find high-value inactive users" },
      }
    );
    fireEvent.click(
      screen.getAllByRole("button", { name: /^Generate SQL$/i })[1]
    );

    await screen.findByText("Generated draft");
    expect(mocks.intelligenceService.generateSql).toHaveBeenCalledWith({
      prompt: "Find high-value inactive users",
      mode: "best",
    });

    fireEvent.click(screen.getByRole("button", { name: /use in editor/i }));

    expect(screen.getByLabelText("SQL query editor")).toHaveValue(
      "SELECT wallet, email FROM users WHERE engagement_score > 80;"
    );
  });

  it("opens one helper panel at a time", async () => {
    renderQueryTab();

    const generateToggle = screen.getByRole("button", {
      name: /^Generate SQL$/i,
    });
    const starterToggle = screen.getByRole("button", {
      name: /^Starter Queries$/i,
    });

    expect(screen.queryByText("Generated draft")).not.toBeInTheDocument();
    expect(screen.queryByText("Starter queries")).not.toBeInTheDocument();

    fireEvent.click(generateToggle);
    expect(
      screen.getByPlaceholderText(
        "Find dormant high-value users with email addresses"
      )
    ).toBeInTheDocument();

    fireEvent.click(starterToggle);
    expect(screen.getByText("Starter queries")).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(
        "Find dormant high-value users with email addresses"
      )
    ).not.toBeInTheDocument();
  });
});
