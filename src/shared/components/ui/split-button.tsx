"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SplitButtonProps {
  children: React.ReactNode;
  dropdownContent: React.ReactNode;
  onMainClick?: () => void;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function SplitButton({
  children,
  dropdownContent,
  onMainClick,
  variant = "outline",
  size = "sm",
  className,
}: SplitButtonProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Button
        variant={variant}
        size={size}
        onClick={onMainClick}
        className="bg-background hover:bg-muted/50 rounded-r-none border-r-0 px-4 py-2 transition-colors"
      >
        {children}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className="bg-background hover:bg-muted/50 border-border rounded-l-none border-l px-2 py-2 transition-colors"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {dropdownContent}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
