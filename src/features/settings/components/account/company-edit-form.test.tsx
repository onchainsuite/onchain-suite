import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import CompanyEditForm from "./company-edit-form";

const mocks = vi.hoisted(() => ({
  apiClient: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock("@/lib/api-client", () => ({
  apiClient: mocks.apiClient,
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: () => ({
      data: {
        session: { activeOrganizationId: "org_test_123" },
      },
    }),
  },
}));

vi.mock("@/lib/utils", async () => {
  const actual = await vi.importActual("@/lib/utils");
  return {
    ...actual,
    getSelectedOrganizationId: () => "org_test_123",
  };
});

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/shared/hooks/client/use-timezones", () => ({
  useTimezones: () => ({ items: [], loading: false }),
}));

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children?: ReactNode }) => <>{children}</>,
  motion: {
    form: ({ children, ...props }: { children?: ReactNode }) => (
      <form {...props}>{children}</form>
    ),
    div: ({ children, ...props }: { children?: ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <span>{placeholder ?? ""}</span>
  ),
  SelectContent: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({ children }: { children?: ReactNode }) => (
    <button type="button">{children}</button>
  ),
}));

describe("CompanyEditForm", () => {
  it("loads and saves project settings through the dedicated project settings endpoint", async () => {
    mocks.apiClient.get.mockResolvedValue({
      data: {
        data: {
          projectName: "Goldgard",
          billingEmail: "billing@goldgard.xyz",
          timezone: "UTC",
          tokenTicker: "$GG",
          primaryChains: ["Ethereum"],
          contractAddresses: [
            { chain: "Ethereum", address: "0xabc", label: "Main Token" },
          ],
          treasuryWallets: [{ address: "0xtreasury", label: "Treasury" }],
          teamWallets: [{ address: "0xteam", label: "Deployer" }],
        },
      },
    });

    mocks.apiClient.put.mockResolvedValue({ data: { success: true } });

    render(<CompanyEditForm />);

    await screen.findByText("Project Settings");
    expect(screen.getByText("Goldgard")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const tickerInput = screen.getByPlaceholderText("$SUITE");
    fireEvent.change(tickerInput, { target: { value: "$GG2" } });

    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() => {
      expect(mocks.apiClient.put).toHaveBeenCalledWith(
        "/organization/project-settings",
        expect.objectContaining({
          projectName: "Goldgard",
          tokenTicker: "$GG2",
          primaryChains: ["Ethereum"],
        }),
        expect.anything()
      );
    });
  });
});
