import { ArrowRight, GitMerge, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Profile {
  id: string;
  email: string;
  wallets: number;
  lastActive: string;
}

interface DuplicateProfileCardProps {
  id: number;
  profiles: Profile[];
  confidence: number;
  reason: string;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
}

export function DuplicateProfileCard({
  profiles,
  confidence,
  reason,
  isSelected,
  onSelect,
}: DuplicateProfileCardProps) {
  return (
    <Card className="border-2 border-border">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelect}
              className="mt-1 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-base">Potential Duplicate</CardTitle>
                <Badge
                  variant="outline"
                  className={
                    confidence >= 90
                      ? "border-teal-500/50 text-teal-500"
                      : confidence >= 80
                        ? "border-primary/50 text-primary"
                        : "border-yellow-500/50 text-yellow-500"
                  }
                >
                  {confidence}% confidence
                </Badge>
              </div>
              <CardDescription className="mt-1 text-pretty">
                {reason}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 self-start sm:self-center"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-3 min-w-0">
            {profiles.map((profile, idx) => (
              <div key={profile.id}>
                <Card className="bg-accent/50">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1 min-w-0 flex-1">
                        <p className="font-mono text-sm font-medium truncate">
                          {profile.id}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {profile.email}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {profile.wallets} wallets
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Active {profile.lastActive}
                          </Badge>
                        </div>
                      </div>
                      {idx === 0 && (
                        <Badge className="bg-primary/20 text-primary shrink-0 self-start sm:self-center">
                          Primary
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
                {idx === 0 && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1 gap-2">
            <GitMerge className="h-4 w-4" />
            Merge Profiles
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Review Details
          </Button>
          <Button variant="ghost" className="sm:flex-none">
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
