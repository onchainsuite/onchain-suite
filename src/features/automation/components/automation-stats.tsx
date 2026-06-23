import {
  AnalyticsUpIcon,
  DollarCircleIcon,
  Layers01Icon,
  Target01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface AutomationStatsProps {
  stats: {
    active: number;
    entries: number;
    conversions: number;
    revenue: number;
  };
}

const formatRevenue = (value: number) => {
  if (value >= 1000) return `$${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  return `$${value.toLocaleString()}`;
};

export const AutomationStats = ({ stats }: AutomationStatsProps) => {
  const conversionRate =
    stats.entries > 0
      ? `${Math.round((stats.conversions / stats.entries) * 1000) / 10}%`
      : "—";

  const cards = [
    {
      key: "active",
      label: "Active automations",
      value: stats.active.toLocaleString(),
      hint: "running now",
      icon: <Zap className="h-5 w-5" />,
      accent: "from-sky-500/20 to-blue-600/10",
      glow: "rgba(59,130,246,0.35)",
    },
    {
      key: "entries",
      label: "Total entries",
      value: stats.entries.toLocaleString(),
      hint: "wallets entered",
      icon: <HugeiconsIcon icon={Layers01Icon} className="h-5 w-5" />,
      accent: "from-violet-500/20 to-fuchsia-600/10",
      glow: "rgba(139,92,246,0.35)",
    },
    {
      key: "conversions",
      label: "Conversions",
      value: stats.conversions.toLocaleString(),
      hint: `${conversionRate} conversion rate`,
      icon: <HugeiconsIcon icon={Target01Icon} className="h-5 w-5" />,
      accent: "from-emerald-500/20 to-teal-600/10",
      glow: "rgba(16,185,129,0.35)",
    },
    {
      key: "revenue",
      label: "Attributed revenue",
      value: formatRevenue(stats.revenue),
      hint: "from automations",
      icon: <HugeiconsIcon icon={DollarCircleIcon} className="h-5 w-5" />,
      accent: "from-amber-500/20 to-orange-600/10",
      glow: "rgba(245,158,11,0.35)",
      highlight: true,
    },
  ];

  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.25 }}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
        >
          <div
            className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${card.accent} opacity-60 blur-2xl transition-opacity group-hover:opacity-100`}
          />
          <div className="relative flex items-start justify-between">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-foreground`}
            >
              {card.icon}
            </span>
            <HugeiconsIcon
              icon={AnalyticsUpIcon}
              className="h-4 w-4 text-muted-foreground/50"
            />
          </div>
          <div className="relative mt-4">
            <div
              className={`text-2xl font-semibold tracking-tight ${
                card.highlight ? "text-primary" : "text-foreground"
              }`}
            >
              {card.value}
            </div>
            <div className="mt-0.5 text-sm font-medium text-foreground/80">
              {card.label}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{card.hint}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
