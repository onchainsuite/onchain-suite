"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ApiAuthenticationCard,
  EndpointsTable,
  ExampleUsageCard,
  StatsGrid,
} from "@/onchain/api/components";
import { endpoints } from "@/onchain/api/data";

export function APIPage() {
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [apiKey] = useState<string>("sk_live_1234567890abcdef");

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
  };

  const handleToggleVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-balance">
          Data Sandbox API
        </h1>
        <p className="mt-1 text-muted-foreground">
          Explore and test API endpoints
        </p>
      </div>

      <StatsGrid />

      <ApiAuthenticationCard
        apiKey={apiKey}
        showApiKey={showApiKey}
        onToggleVisibility={handleToggleVisibility}
        onCopy={handleCopy}
      />

      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>
            Available endpoints and their specifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EndpointsTable endpoints={endpoints} />
        </CardContent>
      </Card>

      <ExampleUsageCard onCopy={handleCopy} />
    </div>
  );
}
