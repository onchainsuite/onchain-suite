import { Users } from "lucide-react";
import { v7 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const teamMembers = [
  { name: "John Doe", email: "john@onchainsuite.com", role: "Owner" },
  { name: "Alice Smith", email: "alice@onchainsuite.com", role: "Admin" },
  { name: "Bob Johnson", email: "bob@onchainsuite.com", role: "Developer" },
];

export function TeamSettingsTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage team access and permissions
              </CardDescription>
            </div>
          </div>
          <Button className="w-full sm:w-auto">Invite Member</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <div
              key={v7()}
              className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium">{member.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {member.email}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Select defaultValue={member.role.toLowerCase()}>
                  <SelectTrigger className="w-full min-w-[120px] sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
