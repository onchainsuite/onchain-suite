import { type Tag } from "@/r3tain/community/types";

// Mock tags data - in real app this would come from API
export const mockAvailableTags: Tag[] = [
  {
    id: "1",
    name: "Newsletter",
    color: "bg-blue-100 text-blue-800",
    usageCount: 1247,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Beta Tester",
    color: "bg-green-100 text-green-800",
    usageCount: 89,
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    name: "VIP",
    color: "bg-purple-100 text-purple-800",
    usageCount: 156,
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    name: "Early Adopter",
    color: "bg-orange-100 text-orange-800",
    usageCount: 234,
    createdAt: "2024-01-25",
  },
  {
    id: "5",
    name: "Influencer",
    color: "bg-pink-100 text-pink-800",
    usageCount: 67,
    createdAt: "2024-02-05",
  },
];

export const mockPopularTags: Tag[] = [
  {
    id: "p1",
    name: "Customer",
    color: "bg-blue-100 text-blue-800",
    usageCount: 2156,
    createdAt: "2024-01-10",
  },
  {
    id: "p2",
    name: "2025",
    color: "bg-green-100 text-green-800",
    usageCount: 1834,
    createdAt: "2024-01-12",
  },
  {
    id: "p3",
    name: "Staff",
    color: "bg-purple-100 text-purple-800",
    usageCount: 1456,
    createdAt: "2024-01-14",
  },
  {
    id: "p4",
    name: "Influencer",
    color: "bg-orange-100 text-orange-800",
    usageCount: 1234,
    createdAt: "2024-01-16",
  },
  {
    id: "p5",
    name: "Member",
    color: "bg-pink-100 text-pink-800",
    usageCount: 1123,
    createdAt: "2024-01-18",
  },
];
