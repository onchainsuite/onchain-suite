"use client";

import { Check, ChevronsUpDown, FileCode, Globe } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

import type { SetupData } from "@/common/dashboard/types";

interface ProjectSetupStepProps {
  formData: SetupData;
  setFormData: (data: SetupData) => void;
  projectTypeOpen: boolean;
  setProjectTypeOpen: (open: boolean) => void;
  isValidContractAddress: (address: string) => boolean;
  isWeb3Project: () => boolean;
}

const projectTypes = [
  { value: "DeFi", label: "DeFi Protocol" },
  { value: "Gaming", label: "Gaming / NFT" },
  { value: "DAO", label: "DAO / Community" },
  { value: "NFT Marketplace", label: "NFT Marketplace" },
  { value: "Social", label: "Social Platform" },
  { value: "Infrastructure", label: "Infrastructure" },
];

export function ProjectSetupStep({
  formData,
  setFormData,
  projectTypeOpen,
  setProjectTypeOpen,
  isValidContractAddress,
  isWeb3Project,
}: ProjectSetupStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="projectName" className="flex items-center gap-2 mb-2">
          Project Name
          <Badge variant="destructive" className="text-xs">
            Required
          </Badge>
        </Label>
        <Input
          id="projectName"
          placeholder="e.g., YieldFarm DAO"
          value={formData.projectName}
          onChange={(e) =>
            setFormData({ ...formData, projectName: e.target.value })
          }
        />
      </div>

      <div>
        <Label htmlFor="projectType" className="flex items-center gap-2 mb-2">
          Project Type
          <Badge variant="destructive" className="text-xs">
            Required
          </Badge>
        </Label>
        <Popover open={projectTypeOpen} onOpenChange={setProjectTypeOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={projectTypeOpen}
              className="w-full justify-between bg-background hover:bg-accent"
            >
              {formData.projectType ?? "Select project type..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-popover" align="start">
            <Command className="bg-popover">
              <CommandInput
                placeholder="Search or type your own..."
                value={formData.projectType}
                onValueChange={(value) =>
                  setFormData({ ...formData, projectType: value })
                }
              />
              <CommandList>
                <CommandEmpty>
                  <div className="py-2 px-2 text-sm">
                    <p className="text-muted-foreground mb-2">
                      No matches found.
                    </p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setProjectTypeOpen(false);
                      }}
                    >
                      Use &quot;{formData.projectType}&quot;
                    </Button>
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {projectTypes.map((type) => (
                    <CommandItem
                      key={type.value}
                      value={type.value}
                      onSelect={(currentValue) => {
                        setFormData({ ...formData, projectType: currentValue });
                        setProjectTypeOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formData.projectType === type.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {type.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <p className="text-xs text-muted-foreground mt-1">
          Personalizes your dashboard metrics. Type your own if not listed.
        </p>
      </div>

      {isWeb3Project() && (
        <div>
          <Label
            htmlFor="contractAddress"
            className="flex items-center gap-2 mb-2"
          >
            <FileCode className="h-4 w-4" />
            Protocol Contract Address
            <Badge variant="secondary" className="text-xs">
              Recommended
            </Badge>
          </Label>
          <Input
            id="contractAddress"
            placeholder="0x..."
            value={formData.contractAddress ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, contractAddress: e.target.value })
            }
            className={cn(
              formData.contractAddress &&
                !isValidContractAddress(formData.contractAddress)
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            )}
          />
          {formData.contractAddress &&
            !isValidContractAddress(formData.contractAddress) && (
              <p className="text-xs text-destructive mt-1">
                Please enter a valid Ethereum address (0x...)
              </p>
            )}
          <p className="text-xs text-muted-foreground mt-1">
            Enables Onch3n to track on-chain activity and user behavior for
            deeper analytics
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="website" className="flex items-center gap-2 mb-2">
          <Globe className="h-4 w-4" />
          Website / dApp URL
          <Badge variant="secondary" className="text-xs">
            Optional
          </Badge>
        </Label>
        <Input
          id="website"
          type="url"
          placeholder="https://yourproject.com"
          value={formData.website ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, website: e.target.value })
          }
        />
        <p className="text-xs text-muted-foreground mt-1">
          Auto-scrapes favicon and helps tailor email previews
        </p>
      </div>
    </div>
  );
}
