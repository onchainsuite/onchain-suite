import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { type DiffData, type DiffItemProps, type DiffType } from "../types";

export function DiffItem({ diff }: DiffItemProps) {
  const getBarColor = (type: DiffType): string => {
    switch (type) {
      case "Added":
        return "bg-green-500";
      case "Removed":
        return "bg-red-500";
      case "Unchanged":
        return "bg-primary";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{diff.type}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {diff.count.toLocaleString()}
          </span>
          <Badge variant="outline" className="text-xs">
            {diff.percentage}
          </Badge>
        </div>
      </div>
      <div className="w-full h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full ${getBarColor(diff.type)}`}
          style={{ width: diff.percentage }}
        />
      </div>
    </div>
  );
}

export function VersionDiff({ diffData }: { diffData: DiffData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Version Diff (v1.3 vs v1.2)</CardTitle>
        <CardDescription>Changes between versions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {diffData.map((diff) => (
          <DiffItem key={v7()} diff={diff} />
        ))}
      </CardContent>
    </Card>
  );
}
