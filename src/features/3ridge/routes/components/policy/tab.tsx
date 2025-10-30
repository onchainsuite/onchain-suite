import { MoreVertical, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { type Policy, type PolicyCardProps } from "@/3ridge/routes/types";

function PolicyCard({ policy }: PolicyCardProps) {
  return (
    <Card className="border-2 border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{policy.name}</h3>
                  <Badge
                    variant={
                      policy.status === "active" ? "default" : "secondary"
                    }
                  >
                    {policy.status}
                  </Badge>
                  <Badge variant="outline">{policy.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {policy.description}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-accent/50 p-3">
              <p className="font-mono text-sm">{policy.rules}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Policy</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>View Logs</DropdownMenuItem>
              <DropdownMenuItem>
                {policy.status === "active" ? "Disable" : "Enable"}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

export function PoliciesTab({ policies }: { policies: Policy[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Route Policies</CardTitle>
        <CardDescription>
          Manage security and access control policies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {policies.map((policy) => (
          <PolicyCard key={policy.id} policy={policy} />
        ))}
      </CardContent>
    </Card>
  );
}
