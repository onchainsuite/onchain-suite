import { type Community } from "@/r3tain/community/types";

export const mockCommunities: Community[] = [
  {
    id: "r3tain-main",
    name: "R3tain Community",
    subscriberCount: 1247,
    createdAt: "2024-01-15",
    isDefault: true,
  },
  {
    id: "beta-testers",
    name: "Beta Testers",
    subscriberCount: 89,
    createdAt: "2024-02-01",
    isDefault: false,
  },
  {
    id: "newsletter",
    name: "Newsletter Subscribers",
    subscriberCount: 2156,
    createdAt: "2024-01-10",
    isDefault: false,
  },
];
