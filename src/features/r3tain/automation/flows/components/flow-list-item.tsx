"use client";

import {
  BarChart3,
  Copy,
  MoreHorizontal,
  Pause,
  Play,
  Settings,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { AutomationFlow } from "../types";

interface FlowListItemProps {
  flow: AutomationFlow;
  index: number;
}

export function FlowListItem({ flow, index }: FlowListItemProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getActionButton = () => {
    if (flow.status === "draft") {
      return (
        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
          Finish Setup
        </Button>
      );
    }
    if (flow.status === "paused") {
      return (
        <Button
          size="sm"
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-50"
        >
          <Play className="mr-2 h-4 w-4" />
          Resume
        </Button>
      );
    }
    if (flow.status === "active") {
      return (
        <Button
          size="sm"
          variant="outline"
          className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
        >
          <Pause className="mr-2 h-4 w-4" />
          Pause
        </Button>
      );
    }
    return null;
  };

  return (
    <Card
      className={`group transition-all duration-500 hover:shadow-md ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Flow Info */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <Badge
                variant="secondary"
                className={getStatusColor(flow.status)}
              >
                {flow.status.charAt(0).toUpperCase() + flow.status.slice(1)}
              </Badge>
              <span className="text-muted-foreground text-sm">
                since {flow.createdDate}
              </span>
            </div>

            <div>
              <h3 className="text-primary group-hover:text-primary/80 cursor-pointer text-lg font-semibold transition-colors hover:underline">
                {flow.name}
              </h3>
              {flow.description && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {flow.description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              <span className="text-muted-foreground text-sm">
                {flow.isActivated ? "Activated" : "Not activated yet"}
              </span>

              {flow.performance && (
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground">
                    <span className="text-foreground font-medium">
                      {flow.performance.sent}
                    </span>{" "}
                    sent
                  </span>
                  <span className="text-muted-foreground">
                    <span className="text-foreground font-medium">
                      {flow.performance.opened}
                    </span>{" "}
                    opened
                  </span>
                  <span className="text-muted-foreground">
                    <span className="text-foreground font-medium">
                      {flow.performance.clicked}
                    </span>{" "}
                    clicked
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {getActionButton()}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Reports
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
