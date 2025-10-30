import { CheckCircle2, Code, Play, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface SimulationResult {
  status: string;
  statusCode: number;
  responseTime: string;
  response: Record<string, unknown>;
}

interface SimulationResultDisplayProps {
  result: SimulationResult | null;
}

export function SimulationResultDisplay({
  result,
}: SimulationResultDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Result</CardTitle>
        <CardDescription>Response from simulated event</CardDescription>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-accent/50 p-3">
              <div className="flex items-center gap-2">
                {result.status === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-teal-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <span className="font-medium">Status: {result.status}</span>
              </div>
              <Badge variant="outline">{result.statusCode}</Badge>
            </div>

            <div className="space-y-2">
              <Label>Response Time</Label>
              <p className="text-sm text-muted-foreground">
                {result.responseTime}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Response Body</Label>
              <div className="rounded-lg border border-border bg-muted p-4">
                <pre className="overflow-x-auto text-xs">
                  <code>{JSON.stringify(result.response, null, 2)}</code>
                </pre>
              </div>
            </div>

            <Button variant="outline" className="w-full gap-2 bg-transparent">
              <Code className="h-4 w-4" />
              View Full Logs
            </Button>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
            <div className="text-center">
              <Play className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Run a simulation to see results
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
