export interface FieldMapping {
  id: string;
  fileColumnName: string;
  isSelected: boolean;
  matchedField: string | null;
  dataType: string;
  previewData: string[];
  isSuggested: boolean;
  confidence: "high" | "medium" | "low";
}

export interface R3tainField {
  id: string;
  name: string;
  type: string;
  required: boolean;
}

export const R3TAIN_FIELDS: R3tainField[] = [
  { id: "email", name: "Email Address", type: "Email", required: true },
  { id: "phone", name: "Phone Number", type: "Phone", required: false },
  { id: "wallet", name: "Wallet Address", type: "Wallet", required: false },
  { id: "first_name", name: "First Name", type: "Text", required: false },
  { id: "last_name", name: "Last Name", type: "Text", required: false },
  { id: "address", name: "Address", type: "Text", required: false },
  { id: "website", name: "Website", type: "URL", required: false },
  { id: "company", name: "Company", type: "Text", required: false },
  { id: "custom1", name: "Custom Field 1", type: "Text", required: false },
  { id: "custom2", name: "Custom Field 2", type: "Text", required: false },
];
