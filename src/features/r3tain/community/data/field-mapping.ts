import { type FieldMapping } from "@/r3tain/community/types";

// Mock data - in real app this would come from the previous step
export const mockMappings: FieldMapping[] = [
  {
    id: "1",
    fileColumnName: "Email",
    isSelected: true,
    matchedField: "email",
    dataType: "Email",
    previewData: [
      "john.doe@gmail.com",
      "jane.smith@outlook.com",
      "user@example.com",
    ],
    isSuggested: false,
    confidence: "high",
  },
  {
    id: "2",
    fileColumnName: "Number",
    isSelected: true,
    matchedField: "phone",
    dataType: "Phone",
    previewData: ["+1234567890", "+0987654321", "+1122334455"],
    isSuggested: true,
    confidence: "high",
  },
  {
    id: "3",
    fileColumnName: "Wallet",
    isSelected: true,
    matchedField: "wallet",
    dataType: "Wallet",
    previewData: ["0x1234...5678", "0xabcd...efgh", "0x9876...5432"],
    isSuggested: true,
    confidence: "medium",
  },
  {
    id: "4",
    fileColumnName: "Blank",
    isSelected: false,
    matchedField: null,
    dataType: "Text",
    previewData: ["", "", ""],
    isSuggested: false,
    confidence: "low",
  },
];
