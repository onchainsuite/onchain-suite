"use client";

import { CheckCircle2, Plus, Webhook, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  CreateWebhookForm,
  WebhookCard,
  WebhookDeliveryItem,
} from "@/3ridge/routes/components";
import { recentDeliveries, webhooks } from "@/3ridge/routes/data";

export function WebhooksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Webhooks
          </h1>
          <p className="text-pretty text-muted-foreground">
            Configure webhooks to receive real-time event notifications
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Webhook
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Active Webhooks"
          value="8"
          description="3 inactive webhooks"
          icon={Webhook}
          borderColor="border-primary/20"
          bgGradient="bg-gradient-to-br from-primary/5 to-transparent"
        />
        <StatCard
          title="Deliveries Today"
          value="12,847"
          description="98.2% success rate"
          icon={CheckCircle2}
          iconColor="text-teal-500"
          borderColor="border-teal-500/20"
          bgGradient="bg-gradient-to-br from-teal-500/5 to-transparent"
        />
        <StatCard
          title="Failed Deliveries"
          value="234"
          description="Last 24 hours"
          icon={XCircle}
          iconColor="text-red-500"
          borderColor="border-red-500/20"
          bgGradient="bg-gradient-to-br from-red-500/5 to-transparent"
        />
      </div>

      <Tabs defaultValue="webhooks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="deliveries">Recent Deliveries</TabsTrigger>
          <TabsTrigger value="create">Create Webhook</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configured Webhooks</CardTitle>
              <CardDescription>Manage your webhook endpoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {webhooks.map((webhook) => (
                <WebhookCard key={webhook.id} {...webhook} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Deliveries</CardTitle>
              <CardDescription>
                Latest webhook delivery attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDeliveries.map((delivery) => (
                  <WebhookDeliveryItem key={delivery.id} {...delivery} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <CreateWebhookForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
