import { type FilterOption } from "../types";

export const filterOptions: FilterOption[] = [
  // How your contacts are tagged
  { id: "tags", label: "Tags", category: "How your contacts are tagged" },

  // Contact details
  { id: "address", label: "Address", category: "Contact details" },
  { id: "birthday", label: "Birthday", category: "Contact details" },
  { id: "company", label: "Company", category: "Contact details" },
  {
    id: "contact-rating",
    label: "Contact rating",
    category: "Contact details",
  },
  { id: "email-address", label: "Email Address", category: "Contact details" },
  { id: "email-client", label: "Email client", category: "Contact details" },
  { id: "first-name", label: "First name", category: "Contact details" },
  { id: "info-changed", label: "Info changed", category: "Contact details" },
  { id: "language", label: "Language", category: "Contact details" },
  { id: "last-name", label: "Last name", category: "Contact details" },
  { id: "phone-number", label: "Phone number", category: "Contact details" },
  {
    id: "predicted-location",
    label: "Predicted location",
    category: "Contact details",
  },
  { id: "vip-status", label: "VIP status", category: "Contact details" },

  // How your contacts were acquired
  {
    id: "email-date-added",
    label: "Email date added",
    category: "How your contacts were acquired",
  },
  {
    id: "sign-up-source",
    label: "Sign up source",
    category: "How your contacts were acquired",
  },

  // Email & Automation Activity
  {
    id: "email-subscription",
    label: "Email subscription",
    category: "Email & Automation Activity",
  },
  {
    id: "email-engagement",
    label: "Email engagement",
    category: "Email & Automation Activity",
  },
  {
    id: "email-interaction",
    label: "Email interaction",
    category: "Email & Automation Activity",
  },

  // Other activity
  { id: "other-activity", label: "Other activity", category: "Other activity" },

  // Conversations activity
  {
    id: "conversations-activity",
    label: "Conversations activity",
    category: "Conversations activity",
  },
];

export const groupedFilterOptions = filterOptions.reduce(
  (acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  },
  {} as Record<string, FilterOption[]>
);
