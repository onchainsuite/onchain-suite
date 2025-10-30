import { Lightbulb, Target, TrendingUp, Users } from "lucide-react";
import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const recommendations = [
  {
    title: "Increase Retention",
    description:
      "Focus on users who completed 3+ transactions in their first week",
    impact: "High",
    icon: Users,
  },
  {
    title: "Optimize Gas Fees",
    description:
      "Batch transactions during low-traffic hours to reduce costs by 25%",
    impact: "Medium",
    icon: TrendingUp,
  },
  {
    title: "Target Power Users",
    description:
      "Create loyalty program for top 5% of users by transaction volume",
    impact: "High",
    icon: Target,
  },
];

export function SmartRecommendations() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <CardTitle>Smart Recommendations</CardTitle>
        </div>
        <CardDescription>
          AI-powered suggestions to improve performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={v7()}
            className="p-4 rounded-lg bg-secondary hover:bg-accent transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <rec.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{rec.title}</h3>
                  <Badge
                    variant={rec.impact === "High" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {rec.impact} Impact
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {rec.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
