import { render } from "@testing-library/react";
import useSWR from "swr";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { OrganizationStatusBanner } from "./organization-status-banner";

// Mock swr
vi.mock("swr");

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const setConfirmedOrg = () => {
  (authClient.useSession as any).mockReturnValue({
    data: { session: { activeOrganizationId: "org-1" } },
  });
  document.cookie = "onchain.selectedOrgId=org-1; path=/";
};

describe("OrganizationStatusBanner", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    document.cookie = "";
  });

  it("should not render if loading", () => {
    setConfirmedOrg();
    (useSWR as any).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    });

    const { container } = render(<OrganizationStatusBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should not render if active", () => {
    setConfirmedOrg();
    (useSWR as any).mockReturnValue({
      data: { isActive: true, status: "active" },
      isLoading: false,
      error: undefined,
    });

    const { container } = render(<OrganizationStatusBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should toast if inactive", () => {
    setConfirmedOrg();
    (useSWR as any).mockReturnValue({
      data: { isActive: false, status: "suspended" },
      isLoading: false,
      error: undefined,
    });

    render(<OrganizationStatusBanner />);

    expect(toast.error).toHaveBeenCalled();
  });
});
