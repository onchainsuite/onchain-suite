"use client";

import { AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { type Log } from "../types";
import { getLevelColor } from "../utils";

const getLevelIcon = (level: string) => {
  switch (level) {
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "info":
      return <Info className="h-4 w-4 text-blue-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

export function DetailedLogCard({
  level,
  message,
  source,
  user,
  timestamp,
  metadata,
}: Log) {
  return (
    <Card className={`border ${getLevelColor(level)}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {getLevelIcon(level)}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {source}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {level}
                  </Badge>
                  {user !== "system" && (
                    <span className="font-mono text-xs text-muted-foreground">
                      {user}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-medium">{message}</p>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {timestamp}
              </span>
            </div>

            {metadata && (
              <div className="rounded-lg border border-border bg-muted/50 p-2">
                <pre className="overflow-x-auto text-xs">
                  <code>{JSON.stringify(metadata, null, 2)}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
