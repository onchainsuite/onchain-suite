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
