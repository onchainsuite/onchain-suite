"use client";

import { Mail, Send } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import type { EngagementData } from "@/r3tain/community/types";

interface EngagementSectionProps {
  engagement: EngagementData;
}

export function EngagementSection({ engagement }: EngagementSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-foreground hidden text-xl font-semibold lg:block">
        Engagement
      </h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Mail className="h-4 w-4" />
            Email marketing engagement
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Your subscribers, broken down by how often they open and click your
            emails.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{engagement.often}%</span>
                <div>
                  <div className="font-medium">Often</div>
                  <div className="text-muted-foreground text-sm">
                    Your percentage of subscribers who are highly engaged and
                    often open and click your emails.
                  </div>
                </div>
              </div>
              <Send className="h-4 w-4 text-gray-400" />
            </div>
            <Progress value={engagement.often} className="h-2" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">
                  {engagement.sometimes}%
                </span>
                <div>
                  <div className="font-medium">Sometimes</div>
                  <div className="text-muted-foreground text-sm">
                    Your percentage of subscribers who are moderately engaged
                    and sometimes open and click your emails.
                  </div>
                </div>
              </div>
              <Send className="h-4 w-4 text-gray-400" />
            </div>
            <Progress value={engagement.sometimes} className="h-2" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{engagement.rarely}%</span>
                <div>
                  <div className="font-medium">Rarely</div>
                  <div className="text-muted-foreground text-sm">
                    Your percentage of subscribers who are not very engaged and
                    rarely open and click your emails.
                  </div>
                </div>
              </div>
              <Send className="h-4 w-4 text-gray-400" />
            </div>
            <Progress value={engagement.rarely} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
