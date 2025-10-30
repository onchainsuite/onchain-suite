import { Bot } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { dataModules } from "../config";

export function DataPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-balance">
            Data Analytics Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore, query, and collaborate on your blockchain data
          </p>
        </div>
        <Button className="gap-2">
          <Bot className="h-4 w-4" />
          Ask AI
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dataModules.map((module) => (
          <Link key={module.title} href={module.href}>
            <Card className="h-full transition-colors hover:bg-accent cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <module.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                </div>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-primary/20 bg-linear-to-br from-card to-primary/5">
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Your data at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-2xl font-bold">2.4M</div>
              <p className="text-sm text-muted-foreground">Total Records</p>
            </div>
            <div>
              <div className="text-2xl font-bold">156</div>
              <p className="text-sm text-muted-foreground">Active Queries</p>
            </div>
            <div>
              <div className="text-2xl font-bold">23</div>
              <p className="text-sm text-muted-foreground">Schema Entities</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
