import { MoreVertical, Shield, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WalletProviderCardProps {
  name: string;
  status: string;
  users: number;
  zkSync: boolean;
}

export function WalletProviderCard({
  name,
  status,
  users,
  zkSync,
}: WalletProviderCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-medium">{name}</p>
            {zkSync && (
              <Badge
                variant="outline"
                className="gap-1 border-teal-500/50 text-teal-500"
              >
                <Shield className="h-3 w-3" />
                zk-Synced
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {users.toLocaleString()} users
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className={status === "active" ? "bg-teal-500/20 text-teal-500" : ""}
        >
          {status}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Configure</DropdownMenuItem>
            <DropdownMenuItem>View Analytics</DropdownMenuItem>
            <DropdownMenuItem>Enable zk-Sync</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Disable
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
