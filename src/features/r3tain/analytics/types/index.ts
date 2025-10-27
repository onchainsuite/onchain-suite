import { type Primitive } from "@/types/ui";

export type Channel = "email" | "sms" | "all";
export type Period = "Day" | "Week" | "Month";

export interface ChartDataPoint {
  period: string;
  email: number;
  sms: number;
  total: number;
  date: Date;
  [key: string]: Primitive;
}
