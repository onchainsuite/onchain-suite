"use client";

import { Check, ChevronsUpDown, MapPin, Plus, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { State } from "react-country-state-city/dist/esm/types";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

import { useStates } from "./hooks";
import { LoadingSpinner } from "./shared";
import type { BaseSelectProps } from "./types";

interface StateSelectProps extends BaseSelectProps {
  countryName?: string;
  allowCustomInput?: boolean;
}

export function StateSelect({
  countryName,
  value,
  onValueChange,
  placeholder = "Select state...",
  disabled = false,
  className,
  allowCustomInput = true,
}: StateSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const {
    data: states = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useStates(countryName);

  // Reset value when country changes or state doesn't exist in predefined list
  useEffect(() => {
    if (value && countryName && states.length > 0) {
      const stateExists = states.some((state) => state.name === value);
      // Only reset if the value doesn't exist in the predefined list AND it's not a custom input
      // We'll keep custom inputs even if they're not in the predefined list
      if (!stateExists && !allowCustomInput) {
        onValueChange("");
      }
    }
  }, [countryName, states, value, onValueChange, allowCustomInput]);

  // Memoize handlers
  const handleSelect = useCallback(
    (state: State | string) => {
      const stateName = typeof state === "string" ? state : state.name;
      onValueChange(stateName);
      setOpen(false);
      setSearchValue("");
    },
    [onValueChange]
  );

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Handle custom input
  const handleCustomInput = useCallback(() => {
    if (searchValue.trim()) {
      handleSelect(searchValue.trim());
    }
  }, [searchValue, handleSelect]);

  // Check if search value matches any existing state
  const searchMatchesExistingState = useMemo(() => {
    return states.some(
      (state) => state.name.toLowerCase() === searchValue.toLowerCase()
    );
  }, [states, searchValue]);

  // Determine if we should show the custom input option
  const shouldShowCustomInput = useMemo(() => {
    return (
      allowCustomInput &&
      searchValue.trim() &&
      !searchMatchesExistingState &&
      !isLoading
    );
  }, [allowCustomInput, searchValue, searchMatchesExistingState, isLoading]);

  // Determine disabled state and placeholder
  const isDisabled = disabled || !countryName || isLoading;

  const getPlaceholderText = useMemo(() => {
    if (!countryName) return "Select country first";
    if (isLoading) return "Loading states...";
    if (states.length === 0) return "No states available";
    return placeholder;
  }, [countryName, isLoading, placeholder, states.length]);

  // Memoize display content
  const buttonContent = useMemo(() => {
    if (isLoading) {
      return <LoadingSpinner text="Loading states..." />;
    }
    if (value) {
      return (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{value}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        <span>{getPlaceholderText}</span>
      </div>
    );
  }, [isLoading, value, getPlaceholderText]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={isDisabled}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            isDisabled && "cursor-not-allowed opacity-50",
            className
          )}
        >
          {buttonContent}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        align="start"
        style={{ minWidth: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput
            placeholder="Search states..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {isError ? (
              <div className="p-4 text-center">
                <p className="text-muted-foreground mb-2 text-sm">
                  Failed to load states
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  disabled={isFetching}
                >
                  {isFetching ? (
                    <>
                      <div className="mr-2 h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Retry
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <>
                <CommandEmpty>
                  {states.length === 0
                    ? "No states available for this country."
                    : "No state found."}
                </CommandEmpty>

                {/* Custom input option */}
                {shouldShowCustomInput && (
                  <CommandGroup heading="Custom">
                    <CommandItem
                      value={`custom-${searchValue}`}
                      onSelect={handleCustomInput}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="truncate">
                        Add &quot;{searchValue}&quot;
                      </span>
                    </CommandItem>
                  </CommandGroup>
                )}

                {/* Predefined states */}
                {states.length > 0 && (
                  <CommandGroup
                    heading={
                      shouldShowCustomInput ? "Predefined States" : undefined
                    }
                  >
                    {states.map((state) => (
                      <CommandItem
                        key={state.id}
                        value={`${state.name} ${state.state_code}`}
                        onSelect={() => handleSelect(state)}
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{state.name}</span>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4 shrink-0",
                            value === state.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
