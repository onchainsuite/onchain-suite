"use client";

import { DollarSign, Lock, Mail, Users } from "lucide-react";

import { MetricCard } from "./metric-card";

interface MetricsGridProps {
  isNewUser: boolean;
  userType: "DeFi" | "Gaming" | "DAO";
}

export function MetricsGrid({ isNewUser, userType }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="3ridge Auths"
        value={isNewUser ? "5" : "247"}
        change={isNewUser ? undefined : "+12%"}
        progress={isNewUser ? 35 : undefined}
        icon={<Lock className="h-5 w-5" />}
        trend="up"
      />
      <MetricCard
        title="D7 Retention"
        value={isNewUser ? "70%" : "76%"}
        subtitle={isNewUser ? "Goal Set" : "Active"}
        change={isNewUser ? undefined : "+4%"}
        icon={<Users className="h-5 w-5" />}
        trend="up"
        isRadial
      />
      <MetricCard
        title="R3tain Sends"
        value={isNewUser ? "1" : "1,500"}
        subtitle={isNewUser ? "Drips Ready" : "This Week"}
        change={isNewUser ? undefined : "22% ROI"}
        icon={<Mail className="h-5 w-5" />}
        trend="up"
      />
      {userType === "DeFi" && (
        <MetricCard
          title="TVL"
          value="$3.1M"
          change="+8%"
          icon={<DollarSign className="h-5 w-5" />}
          trend="up"
        />
      )}
    </div>
  );
}
