"use client";

import { Building2, Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useLocalStorage } from "@/hooks/client";
import { cn } from "@/lib/utils";

interface Team {
  id: string;
  name: string;
  accountId: string;
}

interface TeamSwitcherProps {
  teams: Team[];
  onCreateTeam: () => void;
}

export const TeamSwitcher = React.memo(function TeamSwitcher({
  teams,
  onCreateTeam,
}: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const { value: currentTeam, setValue: setCurrentTeam } =
    useLocalStorage<string>("dashboard-current-team", teams[0]?.name || "");

  const handleTeamSwitch = React.useCallback(
    (teamName: string) => {
      setCurrentTeam(teamName);
      setOpen(false);
      console.log("Switched to team:", teamName);
    },
    [setCurrentTeam]
  );

  const handleCreateTeam = React.useCallback(() => {
    onCreateTeam();
    setOpen(false);
  }, [onCreateTeam]);

  return (
    <div className="px-2 py-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent"
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="text-sm">Switch Team</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search teams..." />
            <CommandList>
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup heading="Your Teams">
                {teams.map((team) => (
                  <CommandItem
                    key={team.id}
                    value={team.name}
                    onSelect={() => handleTeamSwitch(team.name)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentTeam === team.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-medium">{team.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {team.accountId}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem onSelect={handleCreateTeam}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">Create new team</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
});
