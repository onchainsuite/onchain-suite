import React from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { fadeInUp, staggerContainer } from "../../utils";

interface PlanUsageProps {
  optimisePlan: boolean;
  setOptimisePlan: (value: boolean) => void;
}

const PlanUsage = ({ optimisePlan, setOptimisePlan }: PlanUsageProps) => {
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
            <span className="font-medium text-primary">Growth</span> plan
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
        <div className="grid gap-6 sm:grid-cols-3 lg:gap-8">
          {[
            {
              label: "Email sends",
              used: 8247,
              total: "25k",
              percent: 33,
              colorClass: "text-primary",
            },
            {
              label: "Contacts",
              used: 12847,
              total: "50k",
              percent: 26,
              colorClass: "text-primary",
            },
            {
              label: "On-chain sends",
              used: 1247,
              total: "10k",
              percent: 12,
              colorClass: "text-chart-2",
            },
          ].map((quota, idx) => (
            <motion.div
              key={quota.label}
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
                    className={quota.colorClass}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={`${quota.percent}, 100`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-semibold text-foreground">
                    {quota.percent}%
                  </span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="font-medium text-foreground">{quota.label}</div>
                <div className="text-sm text-muted-foreground">
                  {quota.used.toLocaleString()} / {quota.total}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default PlanUsage;
