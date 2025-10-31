"use client";

import { ExternalLink, TrendingDown } from "lucide-react";
import { v7 } from "uuid";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CampaignChart } from "./campaign-chart";
import { RetentionChart } from "./retention-data";

interface UserData {
  projectName: string;
  userType: "DeFi" | "Gaming" | "DAO";
  trialDaysLeft?: number;
  isNewUser: boolean;
  subscriptionTier: "free_trial" | "limited_free" | "full_paid" | "r3tain_only";
}

const eventData = [
  {
    event: "Wallet Connect",
    time: "10:32 AM",
    impact: "Fed R3tain 5 profiles",
  },
  { event: "Token Swap", time: "10:28 AM", impact: "Triggered cohort update" },
  { event: "NFT Mint", time: "10:15 AM", impact: "Added to Gaming segment" },
];

export function SuiteSpotlight({ userData }: { userData: UserData }) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-balance">
          Your Retention Engine – Live Flows
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion
          type="multiple"
          defaultValue={["3ridge", "r3tain", "onch3n"]}
          className="space-y-4"
        >
          {/* 3ridge Accordion */}
          <AccordionItem
            value="3ridge"
            className="border  rounded-lg px-4 bg-card/50"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">Onboarding Hub</span>
                {userData.userType === "DeFi" && (
                  <Badge
                    variant="outline"
                    className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                  >
                    EVM Flows: 80%
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventData.map((row) => (
                    <TableRow key={v7()}>
                      <TableCell className="font-medium">{row.event}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.time}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {row.impact}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline" className="w-full bg-transparent">
                <ExternalLink className="mr-2 h-4 w-4" />
                Edit Playground
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* R3tain Accordion */}
          <AccordionItem
            value="r3tain"
            className="border  rounded-lg px-4 bg-card/50"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">Campaign Control</span>
                <Badge
                  variant="outline"
                  className="bg-green-500/20 text-green-300 border-green-500/30"
                >
                  Deliverability 98%
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <CampaignChart />
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Sent</span>
                    <span className="font-semibold">1,500 (52%)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Opened</span>
                    <span className="font-semibold">780 (22%)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Clicked</span>
                    <span className="font-semibold">330</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Active Sequences:
                </p>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="font-medium">Welcome Series</p>
                  <p className="text-sm text-muted-foreground">
                    0 sent – Schedule?
                  </p>
                </div>
              </div>
              <Button className="w-full">Launch Now</Button>
            </AccordionContent>
          </AccordionItem>

          {/* Onch3n Accordion */}
          <AccordionItem
            value="onch3n"
            className="border  rounded-lg px-4 bg-card/50"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="text-lg font-semibold">Insights Engine</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <RetentionChart />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-sm font-semibold">AI Tip</span>
                  </div>
                  <p className="text-sm">
                    Target low-engagement users with personalized campaigns
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Cohort Performance
                  </span>
                  <p className="text-2xl font-bold text-foreground">76%</p>
                  <p className="text-xs text-muted-foreground">
                    D7 Retention Rate
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Deep Cohorts
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
