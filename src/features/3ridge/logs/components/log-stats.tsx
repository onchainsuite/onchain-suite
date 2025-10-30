import { StatCard } from "@/ui/stat-card";

import { stats } from "../data";

export function LogsStats() {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          description="Last 24 hours"
          icon={stat.icon}
          variant={stat.variant}
        />
      ))}
    </div>
  );
}
