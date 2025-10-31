"use client";

import { Zap } from "lucide-react";
import { v7 } from "uuid";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { activities } from "@/common/dashboard/data";
import { type Activity } from "@/common/dashboard/types";

export function ActivityFeed() {
  const filterActivities = (type: string) => {
    if (type === "all") return activities;
    return activities.filter((activity) => activity.type === type);
  };

  return (
    <Card className=" bg-card/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl">Recent Events</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="3ridge">3ridge</TabsTrigger>
            <TabsTrigger value="r3tain">R3tain</TabsTrigger>
            <TabsTrigger value="onch3n">Onch3n</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <ActivityList activities={filterActivities("all")} />
          </TabsContent>
          <TabsContent value="3ridge" className="mt-4">
            <ActivityList activities={filterActivities("3ridge")} />
          </TabsContent>
          <TabsContent value="r3tain" className="mt-4">
            <ActivityList activities={filterActivities("r3tain")} />
          </TabsContent>
          <TabsContent value="onch3n" className="mt-4">
            <ActivityList activities={filterActivities("onch3n")} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function ActivityList({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-muted-foreground">
          Primed—Trigger Your First Event?
        </p>
        <Button>
          <Zap className="mr-2 h-4 w-4" />
          Test Event
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-64 pr-4">
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={v7()}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
