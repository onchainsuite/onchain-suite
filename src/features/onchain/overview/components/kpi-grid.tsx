import { DollarSign, TrendingDown, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const kpis = [
  {
    title: "Total Users",
    value: "2.4M",
    change: "+12.3%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Retention Rate",
    value: "68.5%",
    change: "+5.2%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Churn Rate",
    value: "4.2%",
    change: "-1.8%",
    trend: "down",
    icon: TrendingDown,
  },
  {
    title: "Total Volume",
    value: "$145.8M",
    change: "+18.7%",
    trend: "up",
    icon: DollarSign,
  },
];

export function KPIGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p
              className={`text-xs mt-1 flex items-center gap-1 ${kpi.trend === "up" ? "text-green-500" : "text-red-500"}`}
            >
              {kpi.trend === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {kpi.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
