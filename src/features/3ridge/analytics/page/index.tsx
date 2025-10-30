"use client";

import { CheckCircle2, Globe, Shield, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Monitor authentication and security metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Auth Success Rate
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">98.7%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bot Detection</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">247</div>
            <p className="text-xs text-muted-foreground">Blocked this week</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              ZK Proof Success
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">99.2%</div>
            <p className="text-xs text-muted-foreground">12,847 verified</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Chains</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">12</div>
            <p className="text-xs text-muted-foreground">
              Across EVM & non-EVM
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chain Distribution</CardTitle>
            <CardDescription>User activity across blockchains</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { chain: "Ethereum", percentage: 45, color: "bg-primary" },
                { chain: "Base", percentage: 25, color: "bg-secondary" },
                { chain: "Optimism", percentage: 15, color: "bg-chart-3" },
                { chain: "Arbitrum", percentage: 10, color: "bg-chart-4" },
                { chain: "Polygon", percentage: 5, color: "bg-chart-5" },
              ].map((item) => (
                <div key={item.chain}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.chain}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Origin Trends</CardTitle>
            <CardDescription>Authentication method breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { method: "Wallet Connect", count: "12,483", percentage: 51 },
                { method: "Email", count: "7,234", percentage: 29 },
                { method: "OAuth (Social)", count: "3,892", percentage: 16 },
                { method: "Biometric", count: "974", percentage: 4 },
              ].map((item) => (
                <div
                  key={item.method}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{item.method}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.count} users
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {item.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
