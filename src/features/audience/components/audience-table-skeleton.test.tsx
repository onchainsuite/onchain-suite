import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AudienceTableSkeleton } from "./audience-table-skeleton";

describe("AudienceTableSkeleton", () => {
  it("sets accessible loading attributes", () => {
    render(<AudienceTableSkeleton />);
    const status = screen.getByRole("status", { name: "Loading audience" });
    expect(status).toHaveAttribute("aria-busy", "true");
  });

  it("renders a stable number of rows to avoid layout shift", () => {
    const { container } = render(<AudienceTableSkeleton />);
    const rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(8);
  });
});

