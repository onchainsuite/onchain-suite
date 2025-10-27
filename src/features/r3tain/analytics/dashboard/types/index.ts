import type { ChartPayload } from "@/components/ui/chart";

import { type Primitive } from "@/types/ui";

export interface CustomTooltipProps {
  active?: boolean;
  payload?: ChartPayload<number, string>[];
  label?: string;
}

export interface PerformanceChartData {
  period: string;
  value: number;
  date: Date;
  [key: string]: Primitive;
}

export interface CustomDotProps<T = PerformanceChartData> {
  cx?: number;
  cy?: number;
  payload?: T;
  value?: number;
  index?: number;
}

export type Radius = [number, number, number, number];
