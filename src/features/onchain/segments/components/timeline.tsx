import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  type Version,
  type VersionRowProps,
  type VersionStatus,
} from "@/onchain/segments/types";

export function VersionRow({ version }: VersionRowProps) {
  const isPositiveChange = version.change.startsWith("+");
  const hasChange = version.change !== "—";

  const getStatusVariant = (status: VersionStatus): "default" | "secondary" => {
    return status === "Current" ? "default" : "secondary";
  };

  return (
    <tr className="border-b">
      <td className="p-4 font-mono font-semibold">{version.version}</td>
      <td className="p-4 text-muted-foreground">{version.date}</td>
      <td className="p-4">{version.users.toLocaleString()}</td>
      <td className="p-4">
        {hasChange ? (
          <span
            className={`flex items-center gap-1 ${
              isPositiveChange ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositiveChange ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {version.change}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="p-4">
        <Badge variant={getStatusVariant(version.status)}>
          {version.status}
        </Badge>
      </td>
    </tr>
  );
}

export function VersionTimeline({ versions }: { versions: Version[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Version Timeline</CardTitle>
        <CardDescription>Historical segment versions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto border rounded-md">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-sm font-medium text-left">Version</th>
                <th className="p-4 text-sm font-medium text-left">Date</th>
                <th className="p-4 text-sm font-medium text-left">Users</th>
                <th className="p-4 text-sm font-medium text-left">Change</th>
                <th className="p-4 text-sm font-medium text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((version) => (
                <VersionRow key={version.id} version={version} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
