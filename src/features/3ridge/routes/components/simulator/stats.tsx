import { CheckCircle2, Zap } from "lucide-react";

import { StatCard } from "@/ui/stat-card";

export function SimulatorStats() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatCard
        title="Simulations Run"
        value="1,247"
        description="Last 30 days"
        icon={Zap}
        variant="primary"
      />
      <StatCard
        title="Success Rate"
        value="96.8%"
        description="Simulation success"
        icon={CheckCircle2}
        variant="teal"
      />
      <StatCard
        title="Avg Response Time"
        value="124ms"
        description="Across all simulations"
        icon={Zap}
        variant="violet"
      />
    </div>
  );
}
