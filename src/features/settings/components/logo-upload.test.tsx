import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
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
    div: ({ children, className, onClick, ...props }: any) => (
      <div className={className} onClick={onClick} {...props}>
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
  Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

// Mock Button
vi.mock("@/shared/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, className }: any) => (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}));

// Mock Progress
vi.mock("@/shared/components/ui/progress", () => ({
  Progress: ({ value, className }: any) => (
    <div className={className} data-testid="progress" data-value={value} />
  ),
}));

describe("LogoUpload Component", () => {
  const setShowLogoUploadModal = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    (authClient.useSession as any).mockReturnValue({
      data: {
        session: {
          activeOrganizationId: "org-123",
        },
      },
    });
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
    (axios.post as any).mockResolvedValue({ data: { success: true } });

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
        "/api/v1/organization/branding/logo/primary",
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
