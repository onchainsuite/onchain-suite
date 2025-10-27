import type { AutomationFlow } from "@/r3tain/automation/flows/types";

export const mockFlows: AutomationFlow[] = [
  {
    id: "1",
    name: "Welcome new contacts",
    status: "draft",
    createdDate: "June 14, 2025",
    lastModified: "June 14, 2025",
    isActivated: false,
    description: "Automated welcome series for new subscribers",
  },
  {
    id: "2",
    name: "Welcome new contacts",
    status: "draft",
    createdDate: "June 14, 2025",
    lastModified: "June 14, 2025",
    isActivated: false,
    description: "Secondary welcome flow for different segments",
  },
  {
    id: "3",
    name: "Abandoned Cart Recovery",
    status: "active",
    createdDate: "June 10, 2025",
    lastModified: "June 12, 2025",
    isActivated: true,
    description: "Recover lost sales from abandoned shopping carts",
    performance: {
      sent: 245,
      opened: 98,
      clicked: 23,
    },
  },
  {
    id: "4",
    name: "Birthday Campaign",
    status: "paused",
    createdDate: "May 28, 2025",
    lastModified: "June 5, 2025",
    isActivated: true,
    description: "Send birthday wishes and special offers",
    performance: {
      sent: 156,
      opened: 89,
      clicked: 34,
    },
  },
];
