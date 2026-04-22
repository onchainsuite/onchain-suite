import { render } from "@testing-library/react";
import { toast } from "sonner";
import useSWR from "swr";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { authClient } from "@/lib/auth-client";

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

const mockedUseSession = vi.mocked(authClient.useSession);
const mockedUseSWR = vi.mocked(useSWR);

const setConfirmedOrg = () => {
  mockedUseSession.mockReturnValue({
    data: { session: { activeOrganizationId: "org-1" } },
  } as unknown as ReturnType<typeof authClient.useSession>);
  document.cookie = "onchain.selectedOrgId=org-1; path=/";
};

describe("OrganizationStatusBanner", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    document.cookie = "";
  });

  it("should not render if loading", () => {
    setConfirmedOrg();
    mockedUseSWR.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    } as unknown as ReturnType<typeof useSWR>);

    const { container } = render(<OrganizationStatusBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should not render if active", () => {
    setConfirmedOrg();
    mockedUseSWR.mockReturnValue({
      data: { isActive: true, status: "active" },
      isLoading: false,
      error: undefined,
    } as unknown as ReturnType<typeof useSWR>);

    const { container } = render(<OrganizationStatusBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should toast if inactive", () => {
    setConfirmedOrg();
    mockedUseSWR.mockReturnValue({
      data: { isActive: false, status: "suspended" },
      isLoading: false,
      error: undefined,
    } as unknown as ReturnType<typeof useSWR>);

    render(<OrganizationStatusBanner />);

    expect(toast.error).toHaveBeenCalled();
  });
});
