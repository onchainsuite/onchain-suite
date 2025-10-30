import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    label: string;
  };
  iconColor?: string;
  borderColor?: string;
  bgGradient?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  iconColor,
  borderColor,
  bgGradient,
}: StatCardProps) {
  return (
    <Card
      className={`${borderColor ?? "border-primary/20"} ${
        bgGradient ?? "bg-linear-to-br from-primary/5 to-transparent"
      } hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor ?? "text-primary"}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span className={iconColor ?? "text-primary"}>{trend.value}</span>{" "}
            {trend.label}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
