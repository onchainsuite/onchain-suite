import { render, screen } from "@testing-library/react";
import useSWR from "swr";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { OrganizationStatusBanner } from "./organization-status-banner";

// Mock swr
vi.mock("swr");

// Mock shadcn/ui Alert
vi.mock("@/shared/components/ui/alert", () => ({
  Alert: ({ children, className }: any) => (
    <div className={className} role="alert">
      {children}
    </div>
  ),
  AlertTitle: ({ children }: any) => <div>{children}</div>,
  AlertDescription: ({ children }: any) => <div>{children}</div>,
}));

describe("OrganizationStatusBanner", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should not render if loading", () => {
    (useSWR as any).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    });

    const { container } = render(<OrganizationStatusBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should not render if active", () => {
    (useSWR as any).mockReturnValue({
      data: { isActive: true, status: "active" },
      isLoading: false,
      error: undefined,
    });

    const { container } = render(<OrganizationStatusBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render alert if inactive", () => {
    (useSWR as any).mockReturnValue({
      data: { isActive: false, status: "suspended" },
      isLoading: false,
      error: undefined,
    });

    render(<OrganizationStatusBanner />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Account Inactive")).toBeInTheDocument();
    expect(
      screen.getByText(/Your organization account is currently suspended/i)
    ).toBeInTheDocument();
  });
});
