import { Download } from "lucide-react";
import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { StoryChart } from "@/onchain/insights/components";
import { storySteps } from "@/onchain/insights/data";

export function StoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-balance">
            Data Story Generator
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-generated narrative insights from your data
          </p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Card className="border-primary/20 bg-linear-to-br from-card to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Monthly Performance Story</CardTitle>
              <CardDescription>
                Generated on {new Date().toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge variant="secondary">4 Insights</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6 grid md:grid-cols-2 gap-4">
        {storySteps.map((step, index) => (
          <Card key={v7()}>
            <CardHeader>
              <div className="flex items-start gap-4 flex-wrap">
                <div className="p-3 rounded-lg bg-secondary">
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">Step {index + 1}</Badge>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </div>
                <div className={`text-lg sm:text-3xl font-bold ${step.color}`}>
                  {step.metric}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <StoryChart index={index} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
          <CardDescription>Based on the insights above</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-lg bg-secondary">
            <h3 className="font-semibold mb-1">Optimize Onboarding Flow</h3>
            <p className="text-sm text-muted-foreground">
              Reduce friction in the first 24 hours to improve 7-day retention
              by an estimated 12-15%
            </p>
          </div>
          <div className="p-4 rounded-lg bg-secondary">
            <h3 className="font-semibold mb-1">Evening Campaign Focus</h3>
            <p className="text-sm text-muted-foreground">
              Schedule marketing campaigns and feature releases during peak
              engagement hours (6-10 PM)
            </p>
          </div>
          <div className="p-4 rounded-lg bg-secondary">
            <h3 className="font-semibold mb-1">Growth Sustainability</h3>
            <p className="text-sm text-muted-foreground">
              Monitor user quality metrics to ensure growth acceleration
              maintains healthy engagement levels
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
