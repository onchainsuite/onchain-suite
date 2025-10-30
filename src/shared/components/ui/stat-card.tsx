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
  variant?:
    | "primary"
    | "teal"
    | "violet"
    | "red"
    | "blue"
    | "yellow"
    | "default";
  iconColor?: string;
  borderColor?: string;
  bgGradient?: string;
}

const variantStyles = {
  primary: {
    border: "border-primary/20",
    bg: "bg-gradient-to-br from-primary/5 to-transparent",
    icon: "text-primary",
  },
  teal: {
    border: "border-teal-500/20",
    bg: "bg-gradient-to-br from-teal-500/5 to-transparent",
    icon: "text-teal-500",
  },
  violet: {
    border: "border-violet-500/20",
    bg: "bg-gradient-to-br from-violet-500/5 to-transparent",
    icon: "text-violet-500",
  },
  red: {
    border: "border-red-500/20",
    bg: "bg-gradient-to-br from-red-500/5 to-transparent",
    icon: "text-red-500",
  },
  blue: {
    border: "border-blue-500/20",
    bg: "bg-gradient-to-br from-blue-500/5 to-transparent",
    icon: "text-blue-500",
  },
  yellow: {
    border: "border-yellow-500/20",
    bg: "bg-gradient-to-br from-yellow-500/5 to-transparent",
    icon: "text-yellow-500",
  },
  default: {
    border: "border-border",
    bg: "bg-card",
    icon: "text-muted-foreground",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "primary",
  iconColor,
  borderColor,
  bgGradient,
}: StatCardProps) {
  const styles = variantStyles[variant];
  const finalBorderColor = borderColor ?? styles.border;
  const finalBgGradient = bgGradient ?? styles.bg;
  const finalIconColor = iconColor ?? styles.icon;

  return (
    <Card
      className={`${finalBorderColor} ${finalBgGradient} hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${finalIconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span className={finalIconColor}>{trend.value}</span> {trend.label}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
