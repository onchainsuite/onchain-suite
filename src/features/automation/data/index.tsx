import {
  ArrowsRightLeftIcon,
  ClockIcon,
  EnvelopeIcon,
  TagIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import React from "react";

import { LIBRARY_EMAIL_TEMPLATES } from "@/features/templates/library-templates";

// The automation Send-email action reuses the production Email Library
// templates so its fallback options match what users see in the email section
// (full branded HTML bodies + onchain merge variables), not throwaway stubs.
export const emailTemplates = LIBRARY_EMAIL_TEMPLATES.map((template) => ({
  id: template.id,
  name: template.name,
  subject: template.subject,
  category: template.category,
  previewText: template.previewText,
  body: template.html,
}));

// Last-resort fallback for the trigger contract picker — used only when both
// `GET /automations/builder/project-contracts` and the org's project settings
// return no contracts.
export const mockContracts = [
  {
    address: "0x8d35...12cf8",
    name: "Pudgy Penguins",
    chain: "Ethereum",
    users: 714,
  },
  { address: "0x49cf...A28B", name: "Clone X", chain: "Ethereum", users: 342 },
  { address: "0x3Bf2...5e9D", name: "Base Bridge", chain: "Base", users: 1247 },
];

// Fallback event list — used only when the GoldRush onchain catalog
// (`GET /automations/builder/onchain/catalog`) is unavailable.
export const eventTypes = [
  "Transfer",
  "Mint",
  "Bridge",
  "Swap",
  "Approval",
  "Stake",
];

export const triggerNodes = [
  {
    type: "onchain",
    label: "On-chain Event",
    description: "When your users interact with a contract",
    icon: <WalletIcon aria-hidden="true" className="h-5 w-5 text-primary" />,
    color: "emerald",
  },
];

export const actionNodes = [
  {
    type: "send_email",
    label: "Send Email",
    description: "Send an email to the user",
    icon: (
      <EnvelopeIcon aria-hidden="true" className="h-5 w-5 text-indigo-500" />
    ),
    color: "indigo",
  },
  {
    type: "wait",
    label: "Wait",
    description: "Wait for a period of time",
    icon: <ClockIcon aria-hidden="true" className="h-5 w-5 text-amber-500" />,
    color: "amber",
  },
  {
    type: "branch",
    label: "Branch",
    description: "Split based on condition",
    icon: (
      <ArrowsRightLeftIcon
        aria-hidden="true"
        className="h-5 w-5 text-violet-500"
      />
    ),
    color: "violet",
  },
  {
    type: "add_tag",
    label: "Add Tag",
    description: "Add a tag to the user",
    icon: <TagIcon aria-hidden="true" className="h-5 w-5 text-indigo-500" />,
    color: "indigo",
  },
];
