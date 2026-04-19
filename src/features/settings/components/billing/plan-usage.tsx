import { motion } from "framer-motion";
import React from "react";
import { useQuery } from "@tanstack/react-query";

import { Switch } from "@/components/ui/switch";
import { billingService } from "@/features/billing/billing.service";

import { fadeInUp, staggerContainer } from "../../utils";

interface PlanUsageProps {
  optimisePlan: boolean;
  setOptimisePlan: (value: boolean) => void;
}

const PlanUsage = ({ optimisePlan, setOptimisePlan }: PlanUsageProps) => {
  const overviewQuery = useQuery({
    queryKey: ["billing", "overview"],
    queryFn: () => billingService.getOverview(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const usageQuery = useQuery({
    queryKey: ["billing", "usage", "month"],
    queryFn: () => billingService.getUsage({ period: "month" }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const planName = String((overviewQuery.data as any)?.plan?.name ?? "—");
  const usageItemsRaw = (usageQuery.data as any)?.items;
  const usageItems = Array.isArray(usageItemsRaw) ? usageItemsRaw : [];

  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <motion.h2
            variants={fadeInUp}
            className="text-xl font-light tracking-tight text-foreground lg:text-2xl"
          >
            Plan & Usage
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
            You&apos;re on the{" "}
            <span className="font-medium text-primary">{planName}</span> plan
          </motion.p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Optimise plan automatically
          </span>
          <Switch
            checked={optimisePlan}
            onCheckedChange={setOptimisePlan}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      <motion.div
        variants={fadeInUp}
        className="mt-8 border-t border-border/60 pt-8 lg:mt-10 lg:pt-10"
      >
        {overviewQuery.isLoading || usageQuery.isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading billing usage...
          </div>
        ) : overviewQuery.isError || usageQuery.isError ? (
          <div className="text-center py-8 text-muted-foreground">
            Failed to load billing usage.
          </div>
        ) : usageItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card p-8 text-center text-sm text-muted-foreground">
            No usage data available for this period.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-3 lg:gap-8">
            {usageItems.slice(0, 3).map((quota: any, idx: number) => {
              const used = Number(quota?.used ?? 0);
              const limit = quota?.limit !== undefined ? Number(quota.limit) : null;
              const percent =
                limit && limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
              const label = String(quota?.key ?? "Usage");
              const colorClass = idx === 2 ? "text-chart-2" : "text-primary";
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center rounded-2xl border border-border/60 bg-card p-6 lg:p-8"
                >
                  <div className="relative h-28 w-28 lg:h-32 lg:w-32">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        className="text-muted-foreground/20"
                        strokeWidth="2"
                      />
                      <motion.path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        className={colorClass}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={`${percent}, 100`}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-semibold text-foreground">
                        {percent}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="font-medium text-foreground">{label}</div>
                    <div className="text-sm text-muted-foreground">
                      {used.toLocaleString()}
                      {limit && limit > 0 ? ` / ${limit.toLocaleString()}` : ""}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.section>
  );
};

export default PlanUsage;
