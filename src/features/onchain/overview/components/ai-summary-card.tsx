import { Sparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AISummaryCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>AI Summary</CardTitle>
        </div>
        <CardDescription>Here&apos;s what changed today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-semibold text-green-500">↑ 23% increase</span>{" "}
            in new wallet connections on Ethereum mainnet
          </p>
          <p className="text-sm">
            <span className="font-semibold text-primary">Notable spike</span> in
            DeFi protocol interactions during US trading hours
          </p>
          <p className="text-sm">
            <span className="font-semibold text-yellow-500">⚠ Alert:</span>{" "}
            Unusual activity detected in segment &quot;High-Value Traders&quot;
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
