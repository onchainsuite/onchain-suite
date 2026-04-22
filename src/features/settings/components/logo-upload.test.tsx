import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import type { MouseEvent, MouseEventHandler, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { authClient } from "@/lib/auth-client";

import LogoUpload from "./logo-upload";

// Mock axios
vi.mock("axios");

// Mock authClient
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: vi.fn(),
  },
}));

// Mock framer-motion to avoid animation issues
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      onClick,
      ...props
    }: {
      children?: ReactNode;
      className?: string;
      onClick?: MouseEventHandler<HTMLDivElement>;
      [key: string]: unknown;
    }) => (
      <div
        className={className}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(e) => {
          if (!onClick) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(e as unknown as MouseEvent<HTMLDivElement>);
          }
        }}
        {...props}
      >
        {children}
      </div>
    ),
  },
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock Dialog components from shadcn/ui
vi.mock("@/shared/components/ui/dialog", () => ({
  Dialog: ({ children, open }: { children?: ReactNode; open?: boolean }) =>
    open ? <div>{children}</div> : null,
  DialogContent: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogDescription: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogFooter: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock Button
vi.mock("@/shared/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
  }: {
    children?: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    className?: string;
  }) => (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}));

// Mock Progress
vi.mock("@/shared/components/ui/progress", () => ({
  Progress: ({ value, className }: { value?: number; className?: string }) => (
    <div className={className} data-testid="progress" data-value={value} />
  ),
}));

describe("LogoUpload Component", () => {
  const setShowLogoUploadModal = vi.fn();
  const mockedUseSession = vi.mocked(authClient.useSession);
  const mockedAxiosPost = vi.mocked(axios.post);

  beforeEach(() => {
    vi.resetAllMocks();
    mockedUseSession.mockReturnValue({
      data: {
        session: {
          activeOrganizationId: "org-123",
        },
      },
    } as unknown as ReturnType<typeof authClient.useSession>);
  });

  it("should render correctly when open", () => {
    render(
      <LogoUpload
        showLogoUploadModal={true}
        setShowLogoUploadModal={setShowLogoUploadModal}
        logoUploadType="primary"
      />
    );

    expect(screen.getByText(/Upload primary logo/i)).toBeInTheDocument();
    expect(screen.getByText(/SVG, PNG up to 100MB/i)).toBeInTheDocument();
  });

  it("should handle file selection", () => {
    render(
      <LogoUpload
        showLogoUploadModal={true}
        setShowLogoUploadModal={setShowLogoUploadModal}
        logoUploadType="primary"
      />
    );

    const file = new File(["dummy content"], "logo.png", { type: "image/png" });
    // Input is hidden, so we select it by selector
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
      expect(screen.getByText("logo.png")).toBeInTheDocument();
    } else {
      throw new Error("File input not found");
    }
  });

  it("should upload file successfully", async () => {
    mockedAxiosPost.mockResolvedValue({
      data: { success: true },
    } as unknown as Awaited<ReturnType<typeof axios.post>>);

    render(
      <LogoUpload
        showLogoUploadModal={true}
        setShowLogoUploadModal={setShowLogoUploadModal}
        logoUploadType="primary"
      />
    );

    const file = new File(["dummy content"], "logo.png", { type: "image/png" });
    const inputs = document.querySelectorAll('input[type="file"]');
    fireEvent.change(inputs[0], { target: { files: [file] } });

    const uploadButton = screen.getByText("Upload logo");
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/upload/logo/primary",
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-org-id": "org-123",
          }),
        })
      );
    });
  });
});
