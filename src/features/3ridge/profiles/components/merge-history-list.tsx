import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MergeHistoryItem {
  date: string;
  primary: string;
  merged: string[];
  status: "success" | "failed";
}

const mergeHistory: MergeHistoryItem[] = [
  {
    date: "2024-01-15",
    primary: "0x742d...3f4a",
    merged: ["0x8a3c...9b2d", "0x1f5e...7c8b"],
    status: "success",
  },
  {
    date: "2024-01-14",
    primary: "0x9d2a...4e6f",
    merged: ["0x3c7b...1a9e"],
    status: "success",
  },
  {
    date: "2024-01-13",
    primary: "0x6f2d...8c4a",
    merged: ["0x2b8e...5d1c"],
    status: "failed",
  },
];

export function MergeHistoryList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Merge History</CardTitle>
        <CardDescription>View past profile merge operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mergeHistory.map((merge) => (
            <div
              key={v7()}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                {merge.status === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-teal-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                )}
                <div>
                  <p className="font-medium">
                    Merged {merge.merged.length} profile
                    {merge.merged.length > 1 ? "s" : ""} into{" "}
                    <span className="font-mono">{merge.primary}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {merge.merged.join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant={
                    merge.status === "success" ? "default" : "destructive"
                  }
                >
                  {merge.status}
                </Badge>
                <p className="text-sm text-muted-foreground">{merge.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
