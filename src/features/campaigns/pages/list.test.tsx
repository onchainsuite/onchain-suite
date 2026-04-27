import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { CampaignsListsView } from "./list";

vi.mock("next/link", () => {
  return {
    default: ({
      href,
      children,
    }: {
      href: unknown;
      children: React.ReactNode;
    }) => <a href={String(href)}>{children}</a>,
  };
});

vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
    }),
  };
});

vi.mock("next/image", () => {
  return {
    default: ({ src, alt }: { src: unknown; alt: unknown }) => (
      <div
        data-testid="next-image"
        data-src={String(src)}
        data-alt={String(alt)}
      />
    ),
  };
});

vi.mock("sonner", () => {
  return {
    toast: {
      error: vi.fn(),
    },
  };
});

vi.mock("../campaigns.service", () => {
  return {
    campaignsService: {
      listCampaigns: vi.fn(async () => [
        {
          id: "c_1",
          name: "Welcome",
          subject: "Hello",
          status: "draft",
          type: "email-blast",
          createdAt: new Date(),
        },
      ]),
      getCalendar: vi.fn(async () => [
        {
          id: "c_1",
          name: "Welcome",
          status: "draft",
          scheduledFor: new Date().toISOString(),
        },
      ]),
      createCampaign: vi.fn(async () => ({
        id: "created_1",
      })),
      setTemplate: vi.fn(async () => undefined),
    },
  };
});

vi.mock("@/features/templates/templates.service", () => {
  return {
    templatesService: {
      list: vi.fn(async () => [
        {
          id: "t_1",
          name: "Template A",
          previewUrl: "/placeholder.svg",
          updatedAt: new Date().toISOString(),
        },
      ]),
    },
  };
});

vi.mock("../../campaigns/components/table", () => {
  return {
    CampaignsTable: ({ data }: { data: unknown[] }) => (
      <div data-testid="campaigns-table">rows:{data.length}</div>
    ),
  };
});

vi.mock("../../campaigns/components/calendar", () => {
  return {
    CampaignsCalendar: ({ campaigns }: { campaigns: unknown[] }) => (
      <div data-testid="campaigns-calendar">events:{campaigns.length}</div>
    ),
  };
});

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
}

describe("CampaignsListsView", () => {
  it("switches between list, calendar, and library without losing filters", async () => {
    renderWithClient(<CampaignsListsView />);

    expect(await screen.findByTestId("campaigns-table")).toHaveTextContent(
      "rows:1"
    );

    const statusTrigger = screen.getByRole("button", { name: /status:/i });
    expect(statusTrigger.outerHTML).toMatchInlineSnapshot(
      `"<button type=\\"button\\" class=\\"inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground transition-colors hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20\\"><span>Status: All status</span><svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"lucide lucide-chevron-down h-4 w-4 text-muted-foreground\\" aria-hidden=\\"true\\"><path d=\\"m6 9 6 6 6-6\\"></path></svg></button>"`
    );

    fireEvent.click(statusTrigger);
    fireEvent.click(await screen.findByRole("menuitemradio", { name: "Sent" }));
    expect(
      await screen.findByRole("button", { name: /status: sent/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Calendar" }));
    expect(await screen.findByTestId("campaigns-calendar")).toHaveTextContent(
      "events:1"
    );
    expect(
      screen.getByRole("button", { name: /status: sent/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /view library/i }));
    expect(await screen.findByText("Template A")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "List" }));
    expect(await screen.findByTestId("campaigns-table")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /status: sent/i })
    ).toBeInTheDocument();
  });
});
