import { FileText, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import {
  PredictiveChurnChart,
  SmartRecommendations,
  TrendAnalysisChart,
} from "@/onchain/insights/components";

export function InsightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-balance">
            AI Insights Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Data-driven recommendations and predictive analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={PRIVATE_ROUTES.ONCHAIN.INSIGHTS_STORY}>
            <Button variant="outline" className="gap-2 bg-transparent">
              <FileText className="h-4 w-4" />
              View Story
            </Button>
          </Link>
          <Link href={PRIVATE_ROUTES.ONCHAIN.DATA}>
            <Button className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Data Coach
            </Button>
          </Link>
        </div>
      </div>

      <TrendAnalysisChart />

      <div className="grid gap-6 lg:grid-cols-2">
        <SmartRecommendations />
        <PredictiveChurnChart />
      </div>

      <Card className="border-primary/20 bg-linear-to-br from-card to-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Key Insights</CardTitle>
          </div>
          <CardDescription>
            AI-generated insights from your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-background/50">
            <h3 className="font-semibold mb-2">User Engagement Spike</h3>
            <p className="text-sm text-muted-foreground">
              Detected a 34% increase in user engagement during evening hours
              (6-9 PM UTC). Consider optimizing campaigns for this time window.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-background/50">
            <h3 className="font-semibold mb-2">Retention Opportunity</h3>
            <p className="text-sm text-muted-foreground">
              Users who complete onboarding within 24 hours show 3x higher
              retention. Streamline the onboarding flow to capture more users.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-background/50">
            <h3 className="font-semibold mb-2">Cross-Chain Behavior</h3>
            <p className="text-sm text-muted-foreground">
              45% of Ethereum users also interact with Polygon. Consider
              cross-chain incentive programs to boost multi-chain adoption.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
