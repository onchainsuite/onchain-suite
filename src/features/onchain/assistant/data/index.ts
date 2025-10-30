import { FileText, Sparkles, TrendingUp, Users } from "lucide-react";

export const starterMessages = [
  { text: "Explain this query", icon: FileText },
  { text: "Generate next insight", icon: Sparkles },
  { text: "Show wallets with highest drop-off", icon: Users },
  { text: "Analyze recent trends", icon: TrendingUp },
];

export const mockMessages = [
  {
    role: "user",
    content: "Show me the top performing segments this month",
    timestamp: "10:30 AM",
  },
  {
    role: "assistant",
    content:
      "Based on the data, here are your top 3 performing segments this month:\n\n1. **High-Value Traders** - 12,456 users with $45.2M volume (+23% MoM)\n2. **DeFi Power Users** - 3,456 users with $18.9M volume (+15% MoM)\n3. **New Users** - 45,678 users with $12.4M volume (+45% MoM)\n\nThe New Users segment shows exceptional growth. Would you like me to analyze what's driving this increase?",
    timestamp: "10:30 AM",
  },
  {
    role: "user",
    content: "Yes, analyze the New Users growth",
    timestamp: "10:32 AM",
  },
  {
    role: "assistant",
    content:
      "The 45% growth in New Users is primarily driven by:\n\n• **Marketing Campaign**: Recent social media campaign generated 12K signups\n• **Referral Program**: 8K users joined through referrals (+67% vs last month)\n• **Product Launch**: New mobile app attracted 15K downloads\n\nRetention data shows 68% of these users are still active after 7 days, which is above your average of 62%. I recommend focusing on the referral program as it shows the highest quality users.",
    timestamp: "10:32 AM",
  },
];

export const contextItems = [
  { title: "Recent Queries", count: 12 },
  { title: "Active Segments", count: 4 },
  { title: "Pending Alerts", count: 3 },
];
