export interface Profile {
  id: number;
  name: string;
  email: string;
  wallet: string;
  walletFull: string;
  status: string;
  segments: string[];
  tags: string[];
  intelligenceSegments: string[];
  contractLabels: {
    contract: string;
    label: string;
    volume?: string;
    txCount?: number;
  }[];
  churnRisk: string;
  churnScore: number;
  predictedLtv: string;
  revenueAttribution: string | null;
  memberSince: string;
  lastActive: string;
  engagement: string;
  engagementScore: number;
  holdings: string;
  holdingsValue: string;
  onchainActivity: string;
  lastTx: string;
  chain: string;
  dappActivity: {
    totalTxns: number;
    lastInteraction: string;
    lastAction: string;
    activityLevel: string;
    totalVolume: string;
    firstInteraction: string;
  };
  emailStats: {
    sent: number;
    opened: number;
    clicked: number;
    openRate: number;
    clickRate: number;
  };
  notes: string;
}
