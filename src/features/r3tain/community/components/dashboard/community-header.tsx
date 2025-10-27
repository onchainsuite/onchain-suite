"use client";

import {
  ClipboardList,
  FileText,
  Import,
  Inbox,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { ReusableDropdownMenu } from "@/components/common";
import { Button } from "@/ui/button";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import type { CommunityStats } from "@/r3tain/community/types";

interface CommunityHeaderProps {
  stats: CommunityStats;
  onManageCommunity: () => void;
}

export function CommunityHeader({ stats }: CommunityHeaderProps) {
  const { push } = useRouter();
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground mb-2 text-3xl font-bold">Community</h1>
          <h2 className="text-muted-foreground text-xl font-semibold">
            {stats.communityName}
          </h2>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => push(PRIVATE_ROUTES.R3TAIN.ADD_SUBSCRIBERS)}
          >
            View Subscribers
          </Button>
          <ManageCommunity />
        </div>
      </div>

      <p className="text-muted-foreground">
        {stats.totalSubscribers} total subscribers. {stats.emailSubscribers}{" "}
        email subscribers.
      </p>
    </div>
  );
}

function ManageCommunity() {
  const { push } = useRouter();

  const menuItems = [
    {
      icon: UserPlus,
      label: "Add a subscriber",
      onClick: () => push(PRIVATE_ROUTES.R3TAIN.ADD_SUBSCRIBERS),
    },
    {
      icon: Import,
      label: "Import contacts",
      onClick: () => push(PRIVATE_ROUTES.R3TAIN.ADD_SUBSCRIBERS),
    },
    {
      icon: FileText,
      label: "Signup forms",
    },
    {
      icon: ClipboardList,
      label: "Surveys",
    },
    {
      icon: Inbox,
      label: "Inbox",
      onClick: () => push(PRIVATE_ROUTES.R3TAIN.ADD_SUBSCRIBERS),
    },
    {
      icon: Settings,
      label: "Settings",
    },
    {
      icon: Users,
      label: "View communities",
    },
  ];

  return (
    <ReusableDropdownMenu
      triggerText="Manage Community"
      menuItems={menuItems}
    />
  );
}
