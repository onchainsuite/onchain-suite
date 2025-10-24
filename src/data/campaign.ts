export interface Campaign {
  id: number;
  name: string;
  status: "Active" | "Sent" | "Draft" | "Scheduled";
  type: "Automated" | "Regular";
  audience: string;
  openRate: number | null;
  clickRate: number | null;
  lastEdited: Date;
}

export const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Welcome Series",
    status: "Active",
    type: "Automated",
    audience: "New Subscribers",
    openRate: 45.2,
    clickRate: 12.8,
    lastEdited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 2,
    name: "May Newsletter",
    status: "Sent",
    type: "Regular",
    audience: "All Subscribers",
    openRate: 38.7,
    clickRate: 9.3,
    lastEdited: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  },
  {
    id: 3,
    name: "Product Launch",
    status: "Draft",
    type: "Regular",
    audience: "Product Interest",
    openRate: null,
    clickRate: null,
    lastEdited: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    id: 4,
    name: "Abandoned Cart Recovery",
    status: "Active",
    type: "Automated",
    audience: "Cart Abandoners",
    openRate: 52.1,
    clickRate: 18.5,
    lastEdited: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: 5,
    name: "Customer Feedback Survey",
    status: "Scheduled",
    type: "Regular",
    audience: "Recent Purchasers",
    openRate: null,
    clickRate: null,
    lastEdited: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
  },
];
