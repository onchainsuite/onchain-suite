import type { ComponentType, SVGProps } from "react";

export interface Activity {
  time: string;
  message: string;
  type: "r3tain" | "3ridge" | "onch3n";
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface SetupData {
  projectName: string;
  projectType:
    | "DeFi"
    | "Gaming"
    | "DAO"
    | "Other"
    | "NFT Marketplace"
    | "Social"
    | "Infrastructure"
    | string;
  website?: string;
  contractAddress?: string;
  email: string;
  senderDomain?: string;
  analyticsConsent: boolean;
  webhookEndpoint?: string;
  retentionGoal?: number;
  walletAddress?: string;
}

export type ProjectType =
  | "DeFi"
  | "Gaming"
  | "DAO"
  | "Other"
  | "NFT Marketplace"
  | "Social"
  | "Infrastructure";

export interface SetupStepProps {
  formData: SetupData;
  setFormData: (data: SetupData) => void;
}
