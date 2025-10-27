import { type ImportResult } from "@/r3tain/community/types";

// Mock import result - in real app this would come from the API response
export const mockImportResult: ImportResult = {
  id: "import-123",
  status: "partial", // "success" | "partial" | "error"
  timestamp: "2025-07-24T18:32:00Z",
  method: "File Upload",
  totalAttempted: 3,
  successfullyAdded: 2,
  updated: 0,
  communityName: "R3tain Community",
  tags: ["Newsletter", "Beta Tester"],
  errors: [
    {
      id: "error-1",
      type: "validation",
      message: "Invalid email format detected",
      details:
        "Email address 'invalid-email' in row 3 does not match required format",
      affectedRows: [3],
    },
  ],
  warnings: [
    {
      id: "warning-1",
      type: "data_quality",
      message: "Missing phone numbers for some contacts",
      count: 2,
    },
  ],
};
