"use client";

import { Download, Play, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PlaygroundPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight">Playground</h1>
          <p className="text-muted-foreground">
            Test and simulate your configurations
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Play className="mr-2 h-4 w-4" />
            Run Simulation
          </Button>
        </div>
      </div>

      <Tabs defaultValue="auth" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="auth" className="whitespace-nowrap">
            Auth Flow
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="whitespace-nowrap">
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="proofs" className="whitespace-nowrap">
            ZK-Proofs
          </TabsTrigger>
          <TabsTrigger value="code" className="whitespace-nowrap">
            Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="auth" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>
                  Set up your authentication flow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 font-mono text-sm">
                  <div className="rounded-lg bg-muted p-4">
                    <pre className="text-xs overflow-x-auto">
                      {`{
  "provider": "wallet",
  "chains": ["ethereum", "base"],
  "methods": ["metamask", "walletconnect"],
  "verification": {
    "zkProof": true,
    "captcha": false
  }
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See your auth flow in action</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                  <div className="space-y-4">
                    <div className="h-12 w-full rounded-lg bg-primary/20 flex items-center justify-center text-sm font-medium">
                      Connect Wallet Button
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Click &quot;Run Simulation&quot; to test
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Simulator</CardTitle>
              <CardDescription>
                Test webhook payloads and responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4 font-mono text-xs">
                <pre>
                  {`POST /api/webhooks/test
Content-Type: application/json

{
  "event": "user.wallet.connected",
  "data": {
    "userId": "0x742d...35a3",
    "chain": "ethereum",
    "timestamp": "2025-10-29T12:34:56Z"
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proofs">
          <Card>
            <CardHeader>
              <CardTitle>ZK-Proof Verification</CardTitle>
              <CardDescription>
                Test zero-knowledge proof generation and verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Proof verification interface coming soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle>Code Editor</CardTitle>
              <CardDescription>Write and test custom logic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4 font-mono text-xs">
                <pre>
                  {`import { verify3ridgeAuth } from '@3ridge/sdk'

async function handleAuth(wallet: string) {
  const result = await verify3ridgeAuth({
    wallet,
    chain: 'ethereum',
    requireProof: true
  })

  return result.verified
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
