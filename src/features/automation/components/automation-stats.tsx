import { Layers, TrendingUp, Zap } from "lucide-react";

interface AutomationStatsProps {
  stats: { active: number; entries: number; conversions: number; revenue: number };
}

export const AutomationStats = ({ stats }: AutomationStatsProps) => {
  return (
    <div className="mb-8 flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-3 py-1.5">
        <Zap className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">{stats.active}</span>
        <span className="text-xs text-muted-foreground">active</span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-3 py-1.5">
        <Layers className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">
          {stats.entries.toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground">entries</span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-3 py-1.5">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">
          {stats.conversions.toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground">conversions</span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-3 py-1.5">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-primary">
          +${(stats.revenue / 1000).toFixed(0)}k
        </span>
        <span className="text-xs text-muted-foreground">revenue</span>
      </div>
    </div>
  );
};
